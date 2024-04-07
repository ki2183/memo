import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
    ${reset}
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body, html {
        font-size: 16px;
    }
    body {
        background: ${({ theme }: { theme: any }) => theme.bgColor};
        color: ${({ theme }: { theme: any }) => theme.textColor};
        display: block;
        width: 100%;
        height: 100%;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        transition: background-color 0.5s, color 0.5s;
    }
    button { 
        border-right: 1px solid ${({ theme }: { theme: any }) => theme.navBorder};
        border-bottom: 1px solid ${({ theme }: { theme: any }) => theme.navBorder};
        outline: none;
        color: ${({ theme }: { theme: any }) => theme.textColor};
        background-color: ${({ theme }: { theme: any }) => theme.navColor};
        border-radius: 0.5rem;
    }

    button:hover{
        background-color: ${({ theme }: { theme: any }) => theme.navColorHover};
    }

    button:focus{
        background-color: ${({ theme }: { theme: any }) => theme.navColorHover};
    }    
    
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
    -webkit-text-fill-color: ${({ theme }: { theme: any }) => theme.textColor};
    -webkit-box-shadow: 0 0 0px 1000px #ffffff00 inset;
    box-shadow: 0 0 0px 1000px #00000000 inset;
    transition: background-color 5000s ease-in-out 0s;
}

`;