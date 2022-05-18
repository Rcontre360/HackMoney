import * as React from 'react';
import { Upload, Form } from 'antd';

interface AntUploadProps {
	name: string; //name para el formulario
	accept: string;
	actionUrl?: string; // url del endpoint de subida de archivos
	maxFileSize?: number;
	className?: string;
	onChange: any;
	// onUploadSuccess: (result: Record<string, unknown>) => void;
	// onUploadError: (error: Record<string, unknown>) => void;
	onUploading?: (info: Record<string, unknown>) => void;
}

export const AntUploadFile: React.FC<AntUploadProps> = ({
	name,
	maxFileSize,
	accept,
	// onUploadSuccess,
	// onUploadError,
	// onUploading,
	onChange,
	className,
	children,
}) => {
	const uploadConfing = {
		showUploadList: false,
		// si es ruta protegida agregar e incluir el token en las props
		// headers: {
		// 	authorization: `Bearer ${token}`,
		// },
	};

	return (
		<div className="w-full">
			<Form.Item
				name={name}
				valuePropName={name}
				rules={[
					{
						required: false,
						message: 'This is required!',
					},
					() => ({
						validator(_, value) {
							if (maxFileSize && value?.file && value?.file.size) {
								const isAcceptSize =
									value.file.size / 1024 / 1024 < maxFileSize;
								if (!isAcceptSize)
									return Promise.reject(
										new Error(`Image must smaller than ${maxFileSize}MB!`)
									);
							}
							return Promise.resolve();
						},
					}),
				]}
			>
				<Upload.Dragger
					multiple
					className={className}
					accept={accept}
					onChange={(info: any) => {
						if (info.event !== undefined && info.event.percent === 100) {
							onChange(info);
						}
					}}
					{...uploadConfing}
				>
					{children}
				</Upload.Dragger>
			</Form.Item>
		</div>
	);
};
