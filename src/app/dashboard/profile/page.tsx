import AccountDetailsForm from "./AccountDetailsForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl py-6">
      <h1 className="mb-5 text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <AccountDetailsForm />
    </div>
  );
}
