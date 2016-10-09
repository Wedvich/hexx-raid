using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace hexx_raid.Model
{
    public static class QueryableExtensions
    {
        public static IQueryable<Raid> IncludeRelatedEntities(this IQueryable<Raid> raids)
        {
            return raids
                .Include(r => r.Signups).ThenInclude(s => s.Character)
                .Include(r => r.Signups).ThenInclude(s => s.Note);
        }
    }
}
