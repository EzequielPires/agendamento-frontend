import styled from "styled-components";

interface Props {
    show: boolean;
}

export const Container = styled.div<Props>`
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #000;
    z-index: 99999 !important;
    opacity: ${({show}) => show ? 1 : 0};

    transition: .4s;
`