'use client';

import { useState } from 'react';
import { useProjects } from '@/context/ProjectsContext';
import { useToast } from '@/context/ToastContext';
import { ReceiptDto } from '@/api/types/typesMcoService';
import styles from '@/styles/profile/projects/addToProjectModal.module.css';

interface AddToProjectModalProps {
    receipts: ReceiptDto[];
    onClose: () => void;
}

export const AddToProjectModal = ({ receipts, onClose }: AddToProjectModalProps) => {
    const { projects, createProject, addReceiptsToProject } = useProjects();
    const { showToast } = useToast();
    const [newName, setNewName] = useState('');

    const receiptIds = receipts.map(r => r.id!).filter(Boolean);

    const handleAddToExisting = (projectId: string) => {
        addReceiptsToProject(projectId, receiptIds);
        const project = projects.find(p => p.id === projectId);
        showToast('success', `Чеки добавлены в проект «${project?.name}»`);
        onClose();
    };

    const handleCreate = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        const project = createProject(trimmed, receiptIds);
        showToast('success', `Создан проект «${project.name}» с ${receiptIds.length} чек.`);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleCreate();
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Добавить в проект</h2>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
                            <path d="M2 2L24 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round" />
                            <path d="M24 2L2 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {projects.length > 0 && (
                    <div className={styles.projectsList}>
                        {projects.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                className={styles.projectOption}
                                onClick={() => handleAddToExisting(p.id)}
                            >
                                <div className={styles.projectOptionInfo}>
                                    <span className={styles.projectOptionName}>{p.name}</span>
                                    <span className={styles.projectOptionCount}>
                                        {p.receiptIds.length} чек.
                                    </span>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3v10M3 8h10" stroke="#2E374F" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        ))}
                    </div>
                )}

                {projects.length > 0 && (
                    <div className={styles.divider}>или создайте новый</div>
                )}

                {projects.length === 0 && (
                    <p className={styles.emptyHint}>У вас пока нет проектов. Создайте первый:</p>
                )}

                <div className={styles.createForm}>
                    <input
                        className={styles.createInput}
                        type="text"
                        placeholder="Название проекта"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <button
                        type="button"
                        className={styles.createBtn}
                        onClick={handleCreate}
                        disabled={!newName.trim()}
                    >
                        Создать
                    </button>
                </div>
            </div>
        </>
    );
};
