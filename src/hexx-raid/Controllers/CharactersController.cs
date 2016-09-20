using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using hexx_raid.Authentication;
using hexx_raid.BattleNet;
using hexx_raid.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Character = hexx_raid.Model.Character;

namespace hexx_raid.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class CharactersController : Controller
    {
        private readonly HexxRaidContext _context;
        private readonly BattleNetApi _battleNetApi;

        public CharactersController(HexxRaidContext context, BattleNetApi battleNetApi)
        {
            _context = context;
            _battleNetApi = battleNetApi;
        }

        public IEnumerable<Character> GetAll()
        {
            IQueryable<Character> characters = _context.Characters;

            if (HttpContext.User.HasClaim(ClaimTypes.Permissions, Permissions.Audit.View))
            {
                characters = characters.Include(c => c.Audit);
            }

            return characters
                .Where(c => c.IsMain)
                .ToList();
        }

        [HttpPost("audit"), Authorize(Permissions.Audit.Refresh)]
        public async Task<IActionResult> RefreshAudit()
        {
            var characters = await _context.Characters
                .Include(c => c.Audit)
                .ToListAsync();

            var battleNetRequests = characters.Select(c => _battleNetApi.GetCharacter("chamber-of-aspects", c.Name));
            var charactersFromBattleNet = await Task.WhenAll(battleNetRequests);

            foreach (var characterFromBattleNet in charactersFromBattleNet)
            {
                var character = characters.FirstOrDefault(c => c.Name == characterFromBattleNet.Name);
                if (character == null)
                {
                    continue;
                }

                _context.Attach(character);
                if (character.Audit == null)
                {
                    character.Audit = new CharacterAudit
                    {
                        CharacterId = character.CharacterId
                    };
                }

                character.Audit.ItemLevel = characterFromBattleNet.Items.AverageItemLevelEquipped;
                character.Audit.LastUpdated = DateTimeOffset.Now;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
