import type { GetServerSideProps } from 'next';

// /my-bookings is the public name for the client portal (app/client). Kept as a redirect so links from the
// footer, menu sheet and booking emails keep working if the portal moves.
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: '/client', permanent: false },
});

export default function MyBookings() {
  return null;
}
