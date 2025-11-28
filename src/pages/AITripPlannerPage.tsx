import React from 'react';
import AITripPlanner from '../components/AITripPlanner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DevelopmentNotice from '../components/DevelopmentNotice';

const AITripPlannerPage = () => {
  return (
    <main>
      <DevelopmentNotice />
      <Header />
      
      {/* AI Trip Planner Section */}
      <section className="min-h-screen py-24 bg-background ai-trip-planner-container">
        <div className="container mx-auto px-6">
          <AITripPlanner />
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default AITripPlannerPage;