import React, { useEffect, useRef, useState } from "react";
import { patchFile } from "../../../api/api";
import { FileCommentProps } from "../../../models";
import "./FileForm.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/index.ts";
import axios from "axios";

const FileComment: React.FC<FileCommentProps> = ({
	currentFile,
	setForm,
	setFiles,
}) => {
	const prefix = import.meta.env.BUILD_PREFIX || "";
	const newComment = useRef<HTMLTextAreaElement>(null);
	const loginUser = useSelector(
		(state: RootState) => state.users.loginUser
	);
	const userId = loginUser ? loginUser.id : 0;
	const [currentStorageUser, setCurrentStorageUser] =
		useState<number>(userId || 0); // Устанавливаем ID текущего пользователя

	useEffect(() => {
		if (newComment.current) {
			newComment.current.value = currentFile.comment || "";
		}
	}, [currentFile.comment]);

	const onSubmitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		if (userId) {
			setCurrentStorageUser(userId);
		}

		const patchData = {
			...currentFile,
			comment: newComment.current?.value || "",
			user_id: userId || currentStorageUser, // Используем userId или currentStorageUser, если userId пуст
		};

		try {
			let response;
			if (currentStorageUser) {
				response = await patchFile(
					patchData,
					currentStorageUser
				);
			} else {
				response = await patchFile(patchData);
			}
			const data = await response.data;
			if (response.status === 200) {
				setFiles((files) =>
					files.map((file) =>
						file.id === data.id ? data : file
					)
				);
				setForm();
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Ошибка при выполнении patchFile:",
					error.response?.data || error.message
				);
			} else if (error instanceof Error) {
				console.error(
					"Ошибка при выполнении patchFile:",
					error.message
				);
			} else {
				// Неизвестный тип ошибки
				console.error("Неизвестная ошибка:", error);
			}
		}
	};

	const onCloseHandler = () => {
		setForm();
	};

	return (
		<form className="form" onSubmit={onSubmitHandler}>
			<h2 className="form-title">Изм. комментарий</h2>
			<textarea
				placeholder="Новый комментарий"
				ref={newComment}
			/>
			<input type="submit" value="OK" required />
			<button
				className="close"
				onClick={onCloseHandler}
				onKeyDown={onCloseHandler}
				type="button"
				aria-label="Close"
			>
				<img
					src={`${prefix}close.svg`}
					alt="close"
					className="close"
				></img>
			</button>
		</form>
	);
};

export default FileComment;
