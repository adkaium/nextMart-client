"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";



const HomePage = () => {
 const {user} = useUser();
 console.log(user);
  return (
    <div>
      Welcome to the Home Page!
      <Button variant="default">Click Me</Button>
    </div>
  );
};

export default HomePage;
