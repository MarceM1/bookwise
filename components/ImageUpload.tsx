"use client";

// import { FIELD_NAMES } from "@/constants";
import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
// import { error } from "console";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";
// import { FilePath } from "tailwindcss/types/config";

const auntheticator = async () => {
	try {
		const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

		if (!response.ok) {
			const errorText = await response.text();

			throw new Error(`Request failed with status ${response.status}: ${errorText}`)
		}

		const data = await response.json()
		console.log(data)

		const { signature, expire, token } = data
		console.log('data despues de la desestructuracion', data)

		return { token, expire, signature }

	} catch (error: any) {
		throw new Error(`Athentication request failed: ${error.message}`)
	}
}

const {
	env: {
		imagekit: { publicKey, urlEndpoint },
	},
} = config;

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {

	const ikUploadRef = useRef(null)
	const [file, setFile] = useState<{ filePath: string } | null>(null)

	const onError = (error: any) => {
		console.log(error)
		toast({
			title: 'Image uploaded failed',
			description: `Your image could not be uploaded. Please try again.`,
			variant: 'destructive'
		})
	}

	const onSuccess = (res: any) => {
		setFile(res);
		onFileChange(res.filePath)
		toast({
			title: 'Image uploaded successfully',
			description: `${res.filePath} has been uploaded succesfully!`
		})

	}


	return (
		<ImageKitProvider
			publicKey={publicKey}
			urlEndpoint={urlEndpoint}
			authenticator={auntheticator}
		>
			<IKUpload
				className="hidden"
				ref={ikUploadRef}
				onError={onError}
				onSuccess={onSuccess}
				fileName='test-upload.png'
			/>

			<button className="upload-btn" onClick={(e) => {
				e.preventDefault();

				if (ikUploadRef.current) {
					// @ts-ignore
					ikUploadRef.current?.click()
				}
			}}>
				<Image src={'/icons/upload.svg'} alt="upload icon" width={20} height={20} className="object-contain" />
				<p className="text-base text-light-100">Upload a File</p>

				{file && <p className="upload-filename">{file.filePath}</p>}
			</button>

			{file && (
				<IKImage alt={file.filePath} path={file.filePath} width={500} height={300} />
			)}
		</ImageKitProvider>
	)
}

export default ImageUpload