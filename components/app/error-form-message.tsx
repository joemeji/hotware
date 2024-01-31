export default function ErrorFormMessage({ message }: { message?: any }) {
  return (
    <span className="text-red-500 text-sm">{message}</span>
  );
}