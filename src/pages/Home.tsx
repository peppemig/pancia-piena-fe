import Footer from "@/components/Footer";
import Description from "@/components/home/Description";
import FeatureCards from "@/components/home/FeatureCards";
import Hero from "@/components/home/Hero";
import { User } from "firebase/auth";

type HomeProps = {
  user: User | null | undefined;
};

const Home = ({ user }: HomeProps) => {
  return (
    <>
      <Hero user={user} />
      <FeatureCards />
      <Description />
      <Footer />
    </>
  );
};

export default Home;
