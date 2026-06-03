"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn(
      "credentials",
      {
        email,
        password,
        redirect: false,
      }
    );

    setLoading(false);

    if (result?.error) {
      setError("Credenciales incorrectas");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
      >

        <h1 className="text-3xl font-bold text-center mb-2">
          Bodega Tech
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Iniciar sesión
        </p>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          {loading
            ? "Ingresando..."
            : "Entrar"}
        </button>

      </form>

    </div>
  );
}