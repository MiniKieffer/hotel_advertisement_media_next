import Home from './home';

export default async function Page({ params }) {
  const { username } = await params;
  return <Home username={username} />;
}