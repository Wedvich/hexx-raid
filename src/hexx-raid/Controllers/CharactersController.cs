using System.Collections.Generic;
using hexx_raid.Model;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace hexx_raid.Controllers
{
    [Route("api/[controller]"), Authorize]
    public class CharactersController : Controller
    {
        private readonly HexxRaidContext _context;

        public CharactersController(HexxRaidContext context)
        {
            _context = context;
        }

        public IEnumerable<Character> GetAll()
        {
            var userId = HttpContext.User.GetUserId();
            return _context.Characters.Where(c => c.UserId == userId).ToList();
        }
    }
}
