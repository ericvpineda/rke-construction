export async function POST(req) {
  const {email, password} = await req.json();
  return new Response({ status: 200 });
}
