import ScrollToTopBtn from "../custom_ui/ScrollToTopBtn";


const Portfolio = () => {
    return (
        <>
            <div className="grid aspect-[2/1] gap-6 my-5 place-items-stretch sm:grid-cols-[minmax(200px,_1fr)_minmax(200px,_1fr)] ">
                <div className="border-1 border-gray-200">
                    <div className="w-full aspect-[5/3] overflow-hidden flex justify-center items-center ">
                        <a href="https://www.closetogod.site" rel="noopener noreferrer" target="_blank"><img src="/public/img/closetogod.png" alt="closetogod homepage thumbnail image" title="클릭시 홈페이지로 이동합니다" className="w-full object-cover" /></a>
                    </div>
                </div>
                {/* Sola-Scriptura */}
                <div className="border-1 border-gray-200 flex justify-center items-center px-20">
                    <div>
                        <div className="flex justify-between items-center flex-wrap pr-4"><span className="font-serif text-[25px] font-semibold">Sola-Scriptura</span><a href="https://github.com/midbar40/sola_scriptura_vercel" target="_blank" rel="noopener noreferrer" ><span>Github</span></a></div>
                        <div className="pt-10"><span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi quidem blanditiis alias, dolorum vero corrupti earum fugiat doloribus! Odit rem vel, maiores debitis officiis adipisci illo accusamus reiciendis atque doloribus?</span></div>
                        <div className="pt-10"><span>사용기술</span></div>
                        <div className="flex gap-10 pt-2">
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/javascript.svg" alt="javascirpt logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/node-js.svg" alt="node.js logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/mongodb.svg" alt="mongodb logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                        </div>
                    </div>
                </div>
                {/* 집돌이즘 */}
                <div className="border-1 border-gray-200">
                    <div className="w-full aspect-[5/3] overflow-hidden flex justify-center items-center">
                        <a href="https://www.zipdorism.store" rel="noopener noreferrer" target="_blank"><img src="/public/img/zipdorism.png" alt="zipdorism homepage thumbnail image" title="클릭시 홈페이지로 이동합니다" className="w-full object-cover" /></a>
                    </div>
                </div>
                <div className="border-1 border-gray-200 flex justify-center items-center px-20">
                    <div>
                        <div className="flex justify-between items-center flex-wrap pr-4"><span className="font-serif text-[25px] font-semibold">집돌이즘</span><a href="https://github.com/midbar40/next_projet01" target="_blank" rel="noopener noreferrer"><span>Github</span></a></div>
                        <div className="pt-10"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti tenetur vitae ad atque sequi impedit molestias, esse blanditiis exercitationem nam incidunt, officia reiciendis a. Corrupti vitae voluptatibus provident non qui.</span></div>
                        <div className="pt-10"><span>사용기술</span></div>
                        <div className="flex gap-10 pt-2">
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/next.png" alt="javascirpt logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/node-js.svg" alt="node.js logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/postgresql.svg" alt="mongodb logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                        </div>
                    </div>
                </div>
                {/* 킴스블로그 */}
                <div className="border-1 border-gray-200">
                    <div className="w-full aspect-[5/3] overflow-hidden flex justify-center items-center ">
                        <img src="/public/img/kimsblog.png" alt="Kim's Blog thumbnail image" className="w-full object-cover" />
                    </div>
                </div>
                <div className="border-1 border-gray-200 flex justify-center items-center px-20">
                    <div>
                        <div className="flex justify-between items-center flex-wrap pr-4"><span className="font-serif text-[25px] font-semibold">Kim's Blog</span><a href="https://github.com/midbar40/KimsBlog" target="_blank" rel="noopener noreferrer"><span>Github</span></a></div>
                        <div className="pt-10"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti tenetur vitae ad atque sequi impedit molestias, esse blanditiis exercitationem nam incidunt, officia reiciendis a. Corrupti vitae voluptatibus provident non qui.</span></div>
                        <div className="pt-10"><span>사용기술</span></div>
                        <div className="flex gap-10 pt-2">
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/react.svg" alt="javascirpt logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/java.svg" alt="node.js logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/postgresql.svg" alt="mongodb logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                        </div>
                    </div>
                </div>
                {/* 약속해줘 */}
                <div className="border-1 border-gray-200">
                    <div className="w-full aspect-[5/3] overflow-hidden flex justify-center items-center ">
                        <a href="https://drive.google.com/file/d/1wSN3_6M68RgD8ezY2WCBcKbHU3q2TMTz/view?usp=sharing" rel="noopener noreferrer" target="_blank"><img src="/public/img/promise.png" alt="Promise thumbnail image" className="w-full object-cover" title="클릭시 구글드라이브로 이동합니다"/></a>
                    </div>
                </div>
                <div className="border-1 border-gray-200 flex justify-center items-center px-20">
                    <div>
                        <div className="flex justify-between items-center flex-wrap pr-4"><span className="font-serif text-[25px] font-semibold">약속해줘</span><a href="https://github.com/midbar40/reactNative-teamproject-promise" target="_blank" rel="noopener noreferrer"><span>Github</span></a></div>
                        <div className="pt-10"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti tenetur vitae ad atque sequi impedit molestias, esse blanditiis exercitationem nam incidunt, officia reiciendis a. Corrupti vitae voluptatibus provident non qui.</span></div>
                        <div className="pt-10"><span>사용기술</span></div>
                        <div className="flex gap-10 pt-2">
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/react-native.svg" alt="reactNative logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/node-js.svg" alt="node.js logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/firebase.svg" alt="firebase logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                        </div>
                    </div>
                </div>
                {/* 워크넷 */}
                <div className="border-1 border-gray-200">
                    <div className="w-full aspect-[5/3] overflow-hidden flex justify-center items-center ">
                        <a href="https://drive.google.com/file/d/1VDKF7ra83HlvXY5b3OmVCdhPuM1BGHds/view?usp=sharing" rel="noopener noreferrer" target="_blank"><img src="/public/img/warcnet.png" alt="WarCNet thumbnail image" className="w-full object-cover" title="클릭시 구글드라이브로 이동합니다"/></a>
                    </div>
                </div>
                <div className="border-1 border-gray-200 flex justify-center items-center px-20">
                    <div>
                        <div className="flex justify-between items-center flex-wrap pr-4"><span className="font-serif text-[25px] font-semibold">WarCnet</span><a href="https://github.com/midbar40/react-teamproject-warcrnet" target="_blank" rel="noopener noreferrer"><span>Github</span></a></div>
                        <div className="pt-10"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti tenetur vitae ad atque sequi impedit molestias, esse blanditiis exercitationem nam incidunt, officia reiciendis a. Corrupti vitae voluptatibus provident non qui.</span></div>
                        <div className="pt-10"><span>사용기술</span></div>
                        <div className="flex gap-10 pt-2">
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/react.svg" alt="react logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/node-js.svg" alt="node.js logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/mongodb.svg" alt="mongodb logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                        </div>
                    </div>
                </div>
                {/* 눈치캐치 */}
                <div className="border-1 border-gray-200">
                    <div className="w-full aspect-[5/3] overflow-hidden flex justify-center items-center ">
                        <img src="/public/img/snowcatch.png" alt="snowcatch thumbnail image" className="w-full object-cover" />
                    </div>
                </div>
                <div className="border-1 border-gray-200 flex justify-center items-center px-20">
                    <div>
                        <div className="flex justify-between items-center flex-wrap pr-4"><span className="font-serif text-[25px] font-semibold">눈치캐치</span><a href="https://drive.google.com/file/d/1s85fPGu1226HL_iJRdaDJbtZA_vRk_0C/view?usp=sharing" target="_blank" rel="noopener noreferrer"><span>GoogleDrive</span></a></div>
                        <div className="pt-10"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti tenetur vitae ad atque sequi impedit molestias, esse blanditiis exercitationem nam incidunt, officia reiciendis a. Corrupti vitae voluptatibus provident non qui.</span></div>
                        <div className="pt-10"><span>사용기술</span></div>
                        <div className="flex gap-10 pt-2">
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/python.svg" alt="python logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                            <a href="https://iconscout.com/contributors/icon-mafia"><img src="/public/img/yolo.svg" alt="yolo logo" className="w-20 aspect-[3/3] border-1 border-gray-200" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTopBtn />
        </>
    )
}

export default Portfolio