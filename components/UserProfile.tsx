export default function UserProfile({ user }) {
  return (
    <div className={"flex flex-col justify-center items-center text-center py-4"}>
      <img
        src={user.photoURL || "/hacker.png"}
        className={"w-1/5 mx-auto rounded-full"}
        style={{ maxWidth: "150px" }}
      />
      <p className={'mt-4'}>
        <i>@{user.username}</i>
      </p>
      <h2 className={'mt-2 font-bold'}>{user.displayName || "Anonymous User"}</h2>
    </div>
  );
}
