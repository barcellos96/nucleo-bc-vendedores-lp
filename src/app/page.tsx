import "./global.css";

import PreCadastro from "./cadastro-vendedores/page";
import backgroundImg from "./assets/Background.png";

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen -mb-7 bg-cover"
      style={{ backgroundImage: `url(${backgroundImg.src})` }}
    >
      <PreCadastro />
    </div>
  );
}
