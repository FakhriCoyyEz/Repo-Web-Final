'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticsPage() {
    const [assets, setAssets] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    const checkList = [
        '/Assets/logoicteam.png',
        '/Assets/instagram.png',
        '/Assets/cewek.png',
        '/Assets/cowok.png',
        '/Assets/bg web 2-01.png',
        '/Assets/IntroICTEAM.mp4'
    ];

    useEffect(() => {
        const checkAssets = async () => {
            const results: Record<string, boolean> = {};
            for (const path of checkList) {
                try {
                    const res = await fetch(path, { method: 'HEAD' });
                    results[path] = res.ok;
                } catch {
                    results[path] = false;
                }
            }
            setAssets(results);
            setLoading(false);
        };
        checkAssets();
    }, []);

    return (
        <div className="p-8 bg-white text-black min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Diagnostics: Assets & Login</h1>
            
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">1. Asset Check</h2>
                <p className="mb-4 text-sm text-gray-600">
                    Semua file di bawah ini HARUS ada di folder <code>public/Assets/</code> agar website tampil sempurna.
                </p>
                {loading ? <p>Checking...</p> : (
                    <ul className="space-y-2">
                        {checkList.map(path => (
                            <li key={path} className="flex items-center gap-2">
                                <span className={assets[path] ? 'text-green-600' : 'text-red-600'}>
                                    {assets[path] ? '✅' : '❌'}
                                </span>
                                <code className="bg-gray-100 px-2 py-1 rounded">{path}</code>
                                {!assets[path] && <span className="text-xs text-red-500">(File tidak ditemukan)</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
