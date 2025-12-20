"use client";

import Agent from "@/components/Agent";
import { useAuth } from "@/hooks/use-auth";

const Page = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="p-10">
      <p className="mx-5 text-5xl font-semibold">Interview generation</p><br/>
      <Agent
        userName={user?.firstName! + user?.lastName!}
        userId={user?.id}
        // profileImage={user?.profileURL}
        type="generate"
      />
    </div>
  );
};

export default Page;
