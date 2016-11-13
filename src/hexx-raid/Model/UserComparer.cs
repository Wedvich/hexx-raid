using System.Collections.Generic;

namespace hexx_raid.Model
{
    public class UserComparer : IEqualityComparer<User>
    {
        public bool Equals(User x, User y)
        {
            return Equals(x.UserId, y.UserId);
        }

        public int GetHashCode(User user) => user.UserId.GetHashCode();
    }
}
