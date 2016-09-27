using System;
using System.Collections.Generic;
using System.Linq;
using hexx_raid.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hexx_raid.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class RaidsController : Controller
    {
        private readonly HexxRaidContext _context;

        public RaidsController(HexxRaidContext context)
        {
            _context = context;
        }

        public IEnumerable<Raid> GetAll()
        {
            var now = DateTimeOffset.UtcNow;

            return _context.Raids
                .Include(r => r.Signups).ThenInclude(s => s.Character)
                .Include(r => r.Signups).ThenInclude(s => s.Note)
                .Where(r => r.EndTime > now && r.StartTime < now.GetNextWednesday())
                .OrderBy(r => r.StartTime)
                .ToList();
        }

        [HttpGet("next")]
        public IEnumerable<Raid> GetNext()
        {
            var nextWeek = DateTimeOffset.UtcNow.GetNextWednesday();
            return _context.Raids
                .Include(r => r.Signups).ThenInclude(s => s.Character)
                .Include(r => r.Signups).ThenInclude(s => s.Note)
                .Where(r => r.EndTime > nextWeek && r.StartTime < nextWeek.GetNextWednesday())
                .OrderBy(r => r.StartTime)
                .ToList();
        }

        [HttpPost("{id:Guid}")]
        public IActionResult ChangeSignup(Guid id, [FromBody] dynamic body)
        {
            RaidSignupStatus status = body.status;
            string note = body.note;
            
            var raid = _context.Raids
                .Include(r => r.Signups).ThenInclude(s => s.Character)
                .Include(r => r.Signups).ThenInclude(s => s.Note)
                .FirstOrDefault(r => r.RaidId == id);

            if (raid == null)
                return new NotFoundResult();

            var userId = HttpContext.User.GetUserId();

            var existingSignup = raid.Signups.FirstOrDefault(s => s.Character?.UserId == userId);
            if (existingSignup != null)
            {
                _context.Attach(existingSignup);
                existingSignup.Status = status;
                existingSignup.Timestamp = DateTimeOffset.UtcNow;
                if (!string.IsNullOrEmpty(note))
                {
                    if (existingSignup.Note == null)
                    {
                        existingSignup.Note = new Note
                        {
                            CreatingUserId = userId,
                            Text = note,
                            Timestamp = DateTimeOffset.UtcNow
                        };
                    }
                    else
                    {
                        existingSignup.Note.Timestamp = DateTimeOffset.UtcNow;
                        existingSignup.Note.Text = note;
                    }
                }
                else
                {
                    existingSignup.Note = null;
                }

                _context.SaveChanges();
            }
            else
            {
                var user = _context.Users
                    .Include(u => u.Characters)
                    .FirstOrDefault(u => u.UserId == userId);

                if (user == null)
                {
                    return new BadRequestResult();
                }

                var signup = new RaidSignup
                {
                    
                    Timestamp = DateTimeOffset.UtcNow,
                    Character = user.Characters.First(c => c.IsMain),
                    Status = status
                };
                _context.Attach(raid);
                raid.Signups.Add(signup);
                _context.SaveChanges();
            }

            raid = _context.Raids
                .Include(r => r.Signups).ThenInclude(s => s.Character)
                .Include(r => r.Signups).ThenInclude(s => s.Note)
                .FirstOrDefault(r => r.RaidId == id);

            return new OkObjectResult(raid);
        }
    }
}
