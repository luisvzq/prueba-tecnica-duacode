import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  return (
    <Link to={`/user/${user.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-2 border-t">
          <span className="text-sm text-gray-600 hover:text-black">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
