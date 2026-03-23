import ToggleSwitch from '../../componentsApp/ToggleSwitch';

export default function Alarme() {
    return (
        <div className="px-2 w-full h-full"> 
            <h1 className="pb-6 text-slate-200">
                Alarme
            </h1>

            <h1 className="px-2 pb-5 text-center w-full">
                Alarme dans 3 jours 23 heures 17 minutes
            </h1>

            {/* liste des alarmes */}
            <div className="flex flex-row items-center justify-between bg-gray-300/20 rounded-lg w-full h-10 pl-2 pr-2">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="">
                        07:10
                    </h1>
                    <h2 className="text-[8px] ">
                        Une fois
                    </h2>
                </div>
                <ToggleSwitch />
            </div>
            
        </div>
    );
}
