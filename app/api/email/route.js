export async function POST(req, res) {
  const { name, message, email } = await req.json();

  const formData = new FormData();
  formData.append("Full Name", name);
  formData.append("Email", email);
  formData.append("Message", message);

  formData.append("access_key", process.env.WEB3_ACCESS_KEY);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return new Response(JSON.stringify("Form submission success."), {
        status: 200,
      });
    }
    return new Response(
      JSON.stringify({ message: "Unknown failure. Please try again later." }),
      { status: 500 }
    );
  } catch (error) {
    return new Response({ message: error.message }, { status: 500 });
  }
}
