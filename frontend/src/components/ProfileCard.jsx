function ProfileCard({ user, onLogout }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-8
        text-center
        max-w-sm
        mx-auto
      "
    >
      {/* PROFILE IMAGE */}
      <img
        src="https://i.pravatar.cc/150"
        alt="Profile"
        className="
          w-32
          h-32
          rounded-full
          mx-auto
          border-4
          border-black
        "
      />

      {/* PROFILE INFO */}
      <h2 className="text-2xl font-bold mt-5">
        {user?.name ?? "Guest"}
      </h2>

      <p className="text-gray-500 mt-2">
        {user?.email ?? "No email available"}
      </p>

      {/* BUTTON */}
      <button
        type="button"
        onClick={onLogout}
        className="
          mt-6
          bg-black
          text-white
          px-6
          py-3
          rounded-xl
          hover:bg-gray-800
          transition
        "
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileCard;