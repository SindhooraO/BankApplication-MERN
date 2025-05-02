import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const servicesSection = document.getElementById("services");
    servicesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center bg-[#fbe8dc] p-8 md:p-16">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">Experience hassle-free Banking</h1>
          <p className="text-gray-600">
            Say goodbye to long queues and complex procedures and hello to simple, secure banking with Bankly.
          </p>
          <div className="flex gap-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
            <button
              className="text-red-600 border border-red-600 px-4 py-2 rounded"
              onClick={handleLearnMore}
            >
              Learn More →
            </button>
          </div>
        </div>
        <img src={require("../assets/bg.png")} alt="banking" className="md:w-1/2 mt-6 md:mt-0" />
      </section>

      {/* Services */}
      <section id="services" className="p-8">
        <h2 className="text-2xl font-bold mb-6">Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Service title="Account Services" desc="Log in to view balances, updates, and history." />
          <Service title="Fund Management" desc="Deposit and withdraw with ease and security." />
          <Service title="Loan Recommendations" desc="Get tailored loan suggestions based on your credit." />
          <Service title="Account Services" desc="View and manage transactions anytime." />
        </div>
      </section>

      {/* FAQs */}
      <section className=" bg-[#fbe8dc] p-8">
        <h2 className="text-2xl font-bold mb-6">FAQs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <FAQ question="How can I check my account balance and transaction history?" answer="You can log in through app or website." />
          <FAQ question="How do I apply for a loan recommendation?" />
          <FAQ question="Is my personal info secure?" />
          <FAQ question="What payment methods are supported?" />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600 border-t">
        ©2025 Bankly. All rights reserved
      </footer>
    </div>
  );
};

const Service = ({ title, desc }) => (
  <div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const FAQ = ({ question, answer }) => (
  <div>
    <h4 className="font-semibold text-red-600">{question}</h4>
    {answer && <p className="text-gray-600">{answer}</p>}
  </div>
);

export default Home;
