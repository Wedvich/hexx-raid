using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using hexx_raid.Authentication;
using hexx_raid.Model;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Serilog;

namespace hexx_raid.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class UsersController : Controller
    {
        private readonly HexxRaidContext _context;
        private readonly TelemetryClient _telemetryClient;
        private readonly MySqlConnection _dbConnection;

        public UsersController(HexxRaidContext context, MySqlConnection dbCOnnection, TelemetryClient telemetryClient)
        {
            _context = context;
            _telemetryClient = telemetryClient;
            _dbConnection = dbCOnnection;
        }

        [Authorize(Permissions.Users.View)]
        public async Task<IEnumerable<User>> GetAll()
        {
            var extraneousUsers = new List<User>();

            var telemetry = new DependencyTelemetry
            {
                DependencyKind = "SQL",
                DependencyTypeName = nameof(UsersController)
            };

            var timer = new Stopwatch();

            try
            {
                Log.Verbose("Opening connection to MySQL database {Database} on server {DataSource}.",
                    _dbConnection.Database,
                    _dbConnection.DataSource);

                telemetry.Name = _dbConnection.DataSource;

                await _dbConnection.OpenAsync();
                var command = _dbConnection.CreateCommand();
                command.CommandText = "SELECT ID_MEMBER, memberName FROM smf_members";

                telemetry.CommandName = command.CommandText;
                telemetry.StartTime = DateTimeOffset.UtcNow;
                timer.Start();

                using (var reader = command.ExecuteReader())
                {
                    while (await reader.ReadAsync())
                    {
                        extraneousUsers.Add(new User
                        {
                            UserId = (int)(uint)reader["ID_MEMBER"],
                            Name = (string)reader["memberName"],
                            IsRaider = false,
                            IsManagement = false
                        });
                    }
                }

                timer.Stop();
                telemetry.Success = true;
                telemetry.Duration = timer.Elapsed;

                Log.Information(
                    "Executed MySqlCommand ({ElapsedMilliseconds}ms) [CommandTimeout={CommandTimeout}] {CommandText}",
                    timer.ElapsedMilliseconds,
                    command.CommandTimeout,
                    command.CommandText);

                Log.Verbose("Closing connection to MySQL database {Database} on server {DataSource}.",
                    _dbConnection.Database,
                    _dbConnection.DataSource);
            }
            catch (Exception)
            {
                telemetry.Success = false;
                throw;
            }
            finally
            {
                await _dbConnection.CloseAsync();
                _telemetryClient.TrackDependency(telemetry);
            }

            var users = await _context.Users.ToListAsync();
            return users
                .Concat(extraneousUsers.Except(users, new UserComparer()))
                .OrderBy(u => u.Name)
                .ToList();
        }
    }
}
