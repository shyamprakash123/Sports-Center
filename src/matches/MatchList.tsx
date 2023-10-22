import React from "react";
import ProjectListItems from "./MatchListItems";
import { Switch } from "@headlessui/react";

const ProjectList: React.FC = () => {
  const [LiveScores, setLiveScores] = React.useState(true);
  const toggleLive = () => {
    setLiveScores(!LiveScores);
  };
  return (
    <>
      <div className="flex items-center">
        <h2 className="text-2xl font-medium tracking-tight mb-2 mr-4">
          Live Games
        </h2>
        <Switch
          checked={LiveScores}
          onChange={toggleLive}
          className={`${LiveScores ? "bg-green-600" : "bg-red-600"}
              relative inline-flex h-[24px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            aria-hidden="true"
            className={`${LiveScores ? "translate-x-8" : "translate-x-0"}
                pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
      <div className="flex">
        <ProjectListItems
          liveScores={LiveScores}
          setLiveScores={setLiveScores}
        />
      </div>
    </>
  );
};

export default ProjectList;
