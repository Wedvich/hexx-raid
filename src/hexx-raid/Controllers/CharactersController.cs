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
            var characters = GetRaidingCharacters();

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
            var characters = await GetRaidingCharacters()
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
                character.Audit.CloakEnchant = CharacterAudit.GetEnhancementQuality(characterFromBattleNet.Items.Back.TooltipParams.Enchant);
                character.Audit.NeckEnchant = CharacterAudit.GetEnhancementQuality(characterFromBattleNet.Items.Neck.TooltipParams.Enchant);
                character.Audit.Ring1Enchant = CharacterAudit.GetEnhancementQuality(characterFromBattleNet.Items.Finger1.TooltipParams.Enchant);
                character.Audit.Ring2Enchant = CharacterAudit.GetEnhancementQuality(characterFromBattleNet.Items.Finger2.TooltipParams.Enchant);

                var gems = characterFromBattleNet.Items.GetItems()
                    .Where(item => item.BonusLists.Contains(1808))
                    .Select(item => CharacterAudit.GetEnhancementQuality(item.TooltipParams.Gem0));

                character.Audit.SetGems(gems);

                character.Audit.LastRefreshed = DateTimeOffset.Now;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        private IQueryable<Character> GetRaidingCharacters()
        {
            return _context.Characters
                .Join(_context.Users, c => c.UserId, u => u.UserId, (c, u) => new { c, u })
                .Where(t => t.u.IsRaider)
                .Select(t => t.c);
        }
    }
}
