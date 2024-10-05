import { useEffect, useMemo, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const App = () => {
  const launchDate = useMemo(() => new Date(2024, 9, 9, 0, 0, 0), []);

  // @ts-ignore
  const [remainingTime, setRemainingTime] = useState(launchDate - Date.now());
  const [email, setEmail] = useState("");

  const addZero = (value: number) =>
    value.toString().length > 1 ? value : "0" + value.toString();

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  const { mutate: handleAddEmail, isPending } = useMutation({
    mutationKey: ["add-email"],
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/add-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Some error occured. Please try again later!");
      }

      const data = await response.json();

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // @ts-ignore
      setRemainingTime(launchDate - Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div
      className="w-full h-[100dvh] md:p-10 overflow-hidden"
      style={{
        background: `url("https://cdn.pixabay.com/photo/2018/03/26/14/07/space-3262811_1280.jpg") no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex justify-between items-center px-5 md:px-0 py-3 md:py-0">
        <p className="text-white font-bold text-xl md:text-3xl">Codeproofs</p>
        <div className="flex gap-x-4 items-center">
          <button className="border border-white rounded-full p-2 hover:scale-110 delay-100 transition-all">
            <FaFacebookF color="white" size={20} />
          </button>
          <button className="border border-white rounded-full p-2 hover:scale-110 delay-100 transition-all">
            <FaInstagram color="white" size={20} />
          </button>
          <button className="border border-white rounded-full p-2 hover:scale-110 delay-100 transition-all">
            <FaTwitter color="white" size={20} />
          </button>
        </div>
      </div>

      <div className="w-full h-[85%] flex flex-col justify-center gap-y-7 md:px-28 items-center md:items-start">
        <p className="text-white font-extrabold">------------- Coming Soon</p>
        <p className="text-blue-950 text-4xl md:text-7xl font-bold">
          {addZero(days)}:{addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
        </p>

        <form
          className="flex gap-x-3 items-center w-[85%] sm:w-[24rem]"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEmail();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="py-2.5 px-4 rounded-xl w-[75%] text-sm border border-gray-700"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
          <button
            type="submit"
            className={`${
              isPending ? "bg-rose-300" : "bg-rose-600"
            } text-white w-[25%] py-2.5 rounded-xl hover:bg-rose-600/80 delay-100 transition-all text-sm`}
            disabled={isPending}
          >
            {isPending ? "Please wait..." : "Notify me"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
