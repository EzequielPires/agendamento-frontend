import lottieJson from "../../../public/loading.json";
import Lottie from "react-lottie-player";
import { Container } from "./styles";
import { useLoading } from "src/context/LoadingContext";

export function Loading() {
    const {show} = useLoading();
    return (
        <Container show={show}>
            <Lottie
                    loop
                    animationData={lottieJson}
                    play
                    style={{ width: 300, height: 300 }}
                />
        </Container>
    )
}