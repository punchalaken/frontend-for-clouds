import FileList from "../FileList/FileList";
import { createFile, getUserFiles } from "../../../api/api";
import { useState, useEffect } from "react";
import FileAdd from "../FileEdit/FileAdd";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import FileEditPanel from "../FileEdit/FileEditPanel";
import { FileElement, FileType } from "../../../models";
import { NavLink } from "react-router-dom";
import "../FileList/FileList.css";
import { useFetchCheckUserStatus } from "../../../slices/useFetchCheckUserStatus";

function FilePage() {
	const loginUser = useFetchCheckUserStatus();
	const [currentFile, setCurrentFile] = useState<File | null>(null);
	const [files, setFiles] = useState<FileType[]>([]);
	// const [ currentStorageUser, setCurrentStorageUser ] = useState<number>(0);
	const userId = useSelector(
		(state: RootState) => state.users.loginUser?.id ?? 0
	);
	const [currentStorageUser, setCurrentStorageUser] =
		useState<number>(userId); // Устанавливаем ID текущего пользователя
	const userI = window.sharedUserId || 0;

	useEffect(() => {
		if (userId) {
			setCurrentStorageUser(userId);
		}
		let response;
		const fetchData = async () => {
			if (userI !== 0) {
				response = await getUserFiles(userI);
				window.sharedUserId = 0;
			} else {
				response = await getUserFiles(userId);
			}

			const data = response.data;
			setFiles(data);
		};
		fetchData();
	}, [currentStorageUser, userId]);

	const sendFile = async (file: File) => {
		if (!loginUser) {
			console.error("Ошибка: пользователь не авторизован.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("file_name", file.name);
		formData.append(
			"path",
			`uploads/${loginUser.username}_folder/${file.name}`
		);
		formData.append("size", file.size.toString());
		formData.append("user_id", loginUser.id.toString()); // вот тут ID пользователя

		try {
			const response = await createFile(formData);
			setFiles([...files, response]);
			setCurrentFile(response);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	return (
		// <FileContext.Provider value={{ currentStorageUser, setCurrentStorageUser }}>
		<>
			<FileList
				fileList={files}
				setCurrentFile={(file: FileElement | null) =>
					setCurrentFile(file as File | null)
				}
				// @ts-ignore
				currentFile={currentFile}
				// @ts-ignore
				currentUser={loginUser.id}
			/>
			{currentFile && (
				<FileEditPanel
					// @ts-ignore
					currentFile={currentFile}
					// @ts-ignore
					setFiles={setFiles}
					// @ts-ignore
					setCurrentFile={setCurrentFile}
				/>
			)}
			{loginUser?.is_superuser ? (
				<p className="login-admin">
					<NavLink
						to="/admin"
						className={"crud-menu__item"}
					>
						Войти
					</NavLink>
					в админ панель!
				</p>
			) : (
				<div className="login-admin">
					Спасибо что пользуетесь нашим сервисом! 💻
				</div>
			)}
			<FileAdd sendFile={sendFile} />
		</>
		// </FileContext.Provider>
	);
}

export default FilePage;
