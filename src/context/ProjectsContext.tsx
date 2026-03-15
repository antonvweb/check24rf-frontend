'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Project } from '@/api/types/typesMcoService';
import { safeLocalStorage } from '@/utils/storage';

const STORAGE_KEY = 'projects';

interface ProjectsContextType {
    projects: Project[];
    createProject: (name: string, receiptIds?: number[]) => Project;
    deleteProject: (projectId: string) => void;
    renameProject: (projectId: string, newName: string) => void;
    addReceiptsToProject: (projectId: string, receiptIds: number[]) => void;
    removeReceiptFromProject: (projectId: string, receiptId: number) => void;
    getProjectById: (projectId: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

function loadProjects(): Project[] {
    const raw = safeLocalStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as Project[];
    } catch {
        return [];
    }
}

function saveProjects(projects: Project[]) {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);

    // Загружаем из localStorage при монтировании
    useEffect(() => {
        setProjects(loadProjects());
    }, []);

    // Синхронизируем в localStorage при изменении
    useEffect(() => {
        saveProjects(projects);
    }, [projects]);

    const createProject = useCallback((name: string, receiptIds: number[] = []): Project => {
        const project: Project = {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString(),
            receiptIds,
        };
        setProjects(prev => [...prev, project]);
        return project;
    }, []);

    const deleteProject = useCallback((projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    }, []);

    const renameProject = useCallback((projectId: string, newName: string) => {
        setProjects(prev =>
            prev.map(p => (p.id === projectId ? { ...p, name: newName } : p))
        );
    }, []);

    const addReceiptsToProject = useCallback((projectId: string, receiptIds: number[]) => {
        setProjects(prev =>
            prev.map(p => {
                if (p.id !== projectId) return p;
                const unique = receiptIds.filter(id => !p.receiptIds.includes(id));
                return { ...p, receiptIds: [...p.receiptIds, ...unique] };
            })
        );
    }, []);

    const removeReceiptFromProject = useCallback((projectId: string, receiptId: number) => {
        setProjects(prev =>
            prev.map(p => {
                if (p.id !== projectId) return p;
                return { ...p, receiptIds: p.receiptIds.filter(id => id !== receiptId) };
            })
        );
    }, []);

    const getProjectById = useCallback(
        (projectId: string) => projects.find(p => p.id === projectId),
        [projects]
    );

    return (
        <ProjectsContext.Provider
            value={{
                projects,
                createProject,
                deleteProject,
                renameProject,
                addReceiptsToProject,
                removeReceiptFromProject,
                getProjectById,
            }}
        >
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const ctx = useContext(ProjectsContext);
    if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
    return ctx;
}
