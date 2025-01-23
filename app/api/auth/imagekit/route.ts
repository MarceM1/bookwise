import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

//desestructuracion completa de las variables de entorno dentro de config
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});


//Ruta API en nexts !!!
export async function GET() {
    return NextResponse.json(imagekit.getAuthenticationParameters())
}
