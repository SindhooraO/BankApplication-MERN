import React from "react";
import { PhoneCall, Landmark, Mail, AlertCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-[#fbe8dc] shadow-md min-h-screen flex flex-col items-center justify-between">
      {/* Contact Header */}
      <div className="text-center mt-12 px-4">
        <h2 className="text-4xl font-bold text-rose-600">Contact Us</h2>
        <p className="text-slate-600 mt-2 mb-4 text-sm">We’re here to help!</p>
        <h3 className="text-lg font-medium text-neutral-800 mb-6">
          Any Questions or Remarks? Just write us a message!
        </h3>

        {/* Contact Form */}
        <form className="bg-white shadow-lg rounded-lg p-6 space-y-4 w-full max-w-md mx-auto">
          <div className="text-left">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone No</label>
            <input
              type="tel"
              placeholder="Enter your phone"
              className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
            <textarea
              rows="4"
              placeholder="Enter your message"
              className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white w-full py-2 rounded-md hover:bg-rose-700 transition"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-neutral-100 mt-12 w-full px-6 py-8">
        <div className="flex flex-col md:flex-row justify-around text-center md:text-left gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12  bg-[#fbe8dc] rounded-full flex items-center justify-center shadow">
              <PhoneCall className="text-rose-700" />
            </div>
            <p className="font-semibold text-sm mt-2">24×7 Customer Support</p>
            <p className="text-slate-600 text-sm">1800–123–4567</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12  bg-[#fbe8dc] rounded-full flex items-center justify-center shadow">
              <Landmark className="text-rose-700" />
            </div>
            <p className="font-semibold text-sm mt-2">About Bankly</p>
            <p className="text-slate-600 text-sm">Easy banking, smart loans</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12  bg-[#fbe8dc] rounded-full flex items-center justify-center shadow">
              <Mail className="text-rose-700" />
            </div>
            <p className="font-semibold text-sm mt-2">Email Support</p>
            <p className="text-slate-600 text-sm">bankly@gmail.com</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-start gap-2 text-rose-700 text-sm font-medium px-4 text-center">
          <AlertCircle className="w-4 h-4 mt-1" />
          Do not share your OTP, PIN, or password with anyone. Official communication is only from 1800–123–4567 or bankly@gmail.com.
        </div>
      </div>
    </div>
  );
};

export default Contact;
