'use client';

import { useState, useMemo } from 'react';
import { useProjects } from '@/context/ProjectsContext';
import { useMco } from '@/context/McoContext';
import { MOCK_RECEIPTS, ReceiptDto } from '@/api/types/typesMcoService';
import Reference from '@/components/Reference';
import ChangeTheme from '@/components/ChangeTheme';
import styles from '@/styles/profile/projects/projects.module.css';

export const ProjectsView = () => {
    const { projects, deleteProject, removeReceiptFromProject } = useProjects();
    const { userReceipts } = useMco();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Все доступные чеки (бекенд или mock)
    const allReceipts = useMemo<ReceiptDto[]>(() => {
        if (userReceipts?.content && userReceipts.content.length > 0) {
            return userReceipts.content as ReceiptDto[];
        }
        return MOCK_RECEIPTS;
    }, [userReceipts]);

    const receiptMap = useMemo(() => {
        const map = new Map<number, ReceiptDto>();
        allReceipts.forEach(r => {
            if (r.id != null) map.set(r.id, r);
        });
        return map;
    }, [allReceipts]);

    const toggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleDelete = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        deleteProject(projectId);
        if (expandedId === projectId) setExpandedId(null);
    };

    return (
        <div className={styles.projectsView}>
            <header className={styles.header}>
                <div className={styles.header__right}>
                    <Reference />
                    <ChangeTheme />
                </div>
            </header>
            <div className={styles.content}>
                {projects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>Нет проектов</span>
                        <span>
                            Выберите чеки во вкладке «Чеки» и добавьте их в проект
                        </span>
                    </div>
                ) : (
                    <div className={styles.projectsList}>
                        {projects.map(project => {
                            const isOpen = expandedId === project.id;
                            const projectReceipts = project.receiptIds
                                .map(id => receiptMap.get(id))
                                .filter(Boolean) as ReceiptDto[];
                            const totalSum = projectReceipts.reduce((s, r) => s + r.totalSum, 0);

                            return (
                                <div key={project.id} className={styles.projectCard}>
                                    <div
                                        className={styles.projectHeader}
                                        onClick={() => toggleExpand(project.id)}
                                    >
                                        <div className={styles.projectInfo}>
                                            <span className={styles.projectName}>{project.name}</span>
                                            <div className={styles.projectMeta}>
                                                <span>{projectReceipts.length} чек.</span>
                                                <span>{totalSum.toFixed(2)} ₽</span>
                                                <span>
                                                    {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.projectActions}>
                                            <button
                                                type="button"
                                                className={styles.deleteBtn}
                                                onClick={e => handleDelete(e, project.id)}
                                                title="Удалить проект"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path
                                                        d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                            <svg
                                                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5 7.5l5 5 5-5"
                                                    stroke="#2E374F"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className={styles.projectContent}>
                                            {projectReceipts.length === 0 ? (
                                                <p style={{ opacity: 0.5, textAlign: 'center', padding: '12px 0' }}>
                                                    В проекте пока нет чеков
                                                </p>
                                            ) : (
                                                <>
                                                    {projectReceipts.map(receipt => (
                                                        <div key={receipt.id} className={styles.receiptRow}>
                                                            <span>{receipt.rawJson.user}</span>
                                                            <span>
                                                                {new Date(receipt.receiveDate).toLocaleDateString('ru-RU')}
                                                            </span>
                                                            <span>{receipt.totalSum.toFixed(2)} ₽</span>
                                                            <button
                                                                type="button"
                                                                className={styles.removeReceiptBtn}
                                                                onClick={() =>
                                                                    removeReceiptFromProject(project.id, receipt.id!)
                                                                }
                                                                title="Убрать из проекта"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className={styles.projectTotal}>
                                                        <span>Итого:</span>
                                                        <span>{totalSum.toFixed(2)} ₽</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
