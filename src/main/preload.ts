import { contextBridge, ipcRenderer } from 'electron';
import { Plan } from '../types';

contextBridge.exposeInMainWorld('voxelAPI', {
  exportSchem: (plan: Plan) => ipcRenderer.invoke('export:schem', plan),
  exportWorld: (plan: Plan, options: { bedrock?: boolean }) => ipcRenderer.invoke('export:world', plan, options),
  loadExample: (name: string) => ipcRenderer.invoke('load:example', name),
});

export type VoxelAPI = typeof window & {
  voxelAPI: {
    exportSchem(plan: Plan): Promise<string>;
    exportWorld(plan: Plan, options: { bedrock?: boolean }): Promise<string>;
    loadExample(name: string): Promise<string>;
  };
};
