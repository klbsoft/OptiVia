import { useEffect } from "react";
import OpenMap from "./OpenMap"
import { useFooter } from "../../context/FooterContext";
import "../../animation.css"

export default function Map(){
    const {setRightView} = useFooter();
    useEffect(() => {
      setRightView();
    }, []);
    return (
        <>
           
            <OpenMap/>

           
        </>
    )
}