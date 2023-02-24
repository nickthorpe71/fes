import React, { FC } from "react";
import ButtonWithEvent from "./Button";
import Carousel from "./CGPTCarousel";
import CGPTHorizontalBarChartPro from "./CGPTHorizontalBarChartPro";

import img1 from "./assets/39769.jpg";
import img2 from "./assets/2853400.jpg";
import img3 from "./assets/2866352.jpg";
import img4 from "./assets/2866361.jpg";
import img5 from "./assets/2866366.jpg";
import img6 from "./assets/2866368.jpg";

const images = [img1, img2, img3, img4, img5, img6];
const cartData: { label: string; value: number }[] = [
    { label: "Item 1", value: 1 },
    { label: "Item 2", value: 2 },
    { label: "Item 3", value: 3 },
    { label: "Item 4", value: 4 },
    { label: "Item 5", value: 5 },
    { label: "Item 6", value: 6 },
    { label: "Item 7", value: 7 },
    { label: "Item 8", value: 8 },
    { label: "Item 9", value: 9 },
    { label: "Item 10", value: 10 },
];

function App() {
    return (
        <div className='flex h-screen w-screen justify-center items-center'>
            <div className='w-1/2'>
                <CGPTHorizontalBarChartPro data={cartData} />
            </div>
        </div>
    );
}

export default App;
