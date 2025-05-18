"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const API_KEY = "AIzaSyBJ_XaO23gRihdRZsNah6Qs0wQNZqz76p4";
const CX = "9070b50c10eb94a82";

export default function CustomBrowser() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            setResults(data.items || []);
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        }
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    placeholder="Search TypeScript authentication…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit">Search</Button>
            </form>

            <div className="space-y-4">
                {loading &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                    ))}

                {!loading && results.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center">
                        No results yet. Try searching!
                    </p>
                )}

                {!loading &&
                    results.map((item, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    {item.title}
                                </a>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {item.snippet}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
