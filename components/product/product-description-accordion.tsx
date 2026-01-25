"use client";

import { useMemo, useEffect, useState } from "react";
import { Sparkles, Leaf, FlaskConical, BookOpen, AlertTriangle, Info } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ProductDescriptionSection {
    id: string;
    title: string;
    content: string;
    icon: React.ReactNode;
}

interface ProductDescriptionAccordionProps {
    descriptionHtml: string;
    className?: string;
    isRTL?: boolean;
}

/**
 * ProductDescriptionAccordion
 * 
 * A structured, accordion-based product description component following
 * e-commerce best practices from Sephora, Amazon, and other leading platforms.
 * 
 * Features:
 * - Collapsible sections for better scannability
 * - Icons for visual hierarchy
 * - RTL support for Arabic
 * - Smart section detection from various HTML patterns
 */
export function ProductDescriptionAccordion({
    descriptionHtml,
    className,
    isRTL = false,
}: ProductDescriptionAccordionProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Icon mapping based on section title keywords
    const getIconForTitle = (title: string): React.ReactNode => {
        const lowerTitle = title.toLowerCase();

        // Arabic and English keywords for benefits
        if (lowerTitle.includes("الفوائد") || lowerTitle.includes("benefits") || lowerTitle.includes("فوائد") || lowerTitle.includes("فائدة")) {
            return <Sparkles className="w-5 h-5 text-amber-500" />;
        }
        // Ingredients
        if (lowerTitle.includes("المكونات") || lowerTitle.includes("ingredients") || lowerTitle.includes("مكون") || lowerTitle.includes("مكونات")) {
            return <FlaskConical className="w-5 h-5 text-green-500" />;
        }
        // How to use / Usage
        if (lowerTitle.includes("الاستخدام") || lowerTitle.includes("how to use") || lowerTitle.includes("طريقة") || lowerTitle.includes("usage") || lowerTitle.includes("استخدام")) {
            return <BookOpen className="w-5 h-5 text-blue-500" />;
        }
        // Disclaimer / Warning
        if (lowerTitle.includes("تنويه") || lowerTitle.includes("disclaimer") || lowerTitle.includes("warning") || lowerTitle.includes("تحذير") || lowerTitle.includes("ملاحظة")) {
            return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        }
        // Default/Overview icon
        return <Info className="w-5 h-5 text-gray-500" />;
    };

    // Parse the HTML into structured sections
    const sections = useMemo((): ProductDescriptionSection[] => {
        if (!descriptionHtml || !mounted) return [] as ProductDescriptionSection[];

        // Section header patterns to detect
        const sectionPatterns = [
            // Arabic section headers
            /الفوائد\s*(الرئيسية)?:?/gi,
            /المكونات\s*(الفعالة)?:?/gi,
            /طريقة\s*(الاستخدام)?:?/gi,
            /كيفية\s*(الاستخدام)?:?/gi,
            /تنويه:?/gi,
            /تحذير:?/gi,
            /ملاحظة:?/gi,
            // English section headers
            /key benefits:?/gi,
            /benefits:?/gi,
            /ingredients:?/gi,
            /active ingredients:?/gi,
            /how to use:?/gi,
            /directions:?/gi,
            /usage:?/gi,
            /disclaimer:?/gi,
            /warning:?/gi,
        ];

        // Try to parse as HTML first
        const parser = new DOMParser();
        const doc = parser.parseFromString(descriptionHtml, "text/html");
        const textContent = doc.body.textContent || '';

        // Check if we have any section headers
        const hasHeaders = sectionPatterns.some(pattern => pattern.test(textContent));

        if (!hasHeaders) {
            // No structured sections found - return single overview section
            return [{
                id: "section-overview",
                title: isRTL ? "نظرة عامة" : "Overview",
                content: descriptionHtml,
                icon: <Sparkles className="w-5 h-5 text-amber-500" />,
            }];
        }

        // Split content by section headers
        const bodyHTML = doc.body.innerHTML;
        const parsedSections: ProductDescriptionSection[] = [];

        // Get all text nodes and their positions
        const lines = bodyHTML.split(/(<\/?[^>]+>)/g);
        let currentSection: { title: string; content: string[] } | null = null;
        let introContent: string[] = [];

        lines.forEach((segment) => {
            // Check if this segment contains a section header
            let matchedHeader: string | null = null;
            for (const pattern of sectionPatterns) {
                pattern.lastIndex = 0; // Reset regex
                const match = pattern.exec(segment);
                if (match) {
                    matchedHeader = match[0].replace(/:$/, '').trim();
                    break;
                }
            }

            if (matchedHeader) {
                // Save previous section
                if (currentSection) {
                    parsedSections.push({
                        id: `section-${parsedSections.length}`,
                        title: currentSection.title,
                        content: currentSection.content.join(''),
                        icon: getIconForTitle(currentSection.title),
                    });
                } else if (introContent.length > 0) {
                    // Save intro content
                    parsedSections.push({
                        id: "section-intro",
                        title: isRTL ? "نظرة عامة" : "Overview",
                        content: introContent.join(''),
                        icon: <Sparkles className="w-5 h-5 text-amber-500" />,
                    });
                }

                // Start new section
                currentSection = {
                    title: matchedHeader,
                    content: [],
                };
                // Remove the header from the segment if it's there
                const remainder = segment.replace(new RegExp(matchedHeader + ':?', 'gi'), '').trim();
                if (remainder) {
                    currentSection.content.push(remainder);
                }
            } else if (currentSection) {
                currentSection.content.push(segment);
            } else {
                introContent.push(segment);
            }
        });

        // Don't forget the last section
        // TypeScript narrowing fix: use type assertion since currentSection can be mutated in forEach
        if (currentSection !== null) {
            const finalSection = currentSection as { title: string; content: string[] };
            if (finalSection.content.length > 0) {
                parsedSections.push({
                    id: `section-${parsedSections.length}`,
                    title: finalSection.title,
                    content: finalSection.content.join(''),
                    icon: getIconForTitle(finalSection.title),
                });
            }
        }

        // If we didn't find any sections, return single overview
        if (parsedSections.length === 0) {
            return [{
                id: "section-overview",
                title: isRTL ? "نظرة عامة" : "Overview",
                content: descriptionHtml,
                icon: <Sparkles className="w-5 h-5 text-amber-500" />,
            }];
        }

        return parsedSections;
    }, [descriptionHtml, isRTL, mounted]);

    // SSR/hydration guard
    if (!mounted) {
        return (
            <div
                className={cn(
                    "prose prose-sm dark:prose-invert max-w-none",
                    isRTL && "text-right",
                    className
                )}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
        );
    }

    // If only one section or no structured content, show as-is with nice formatting
    if (sections.length <= 1) {
        return (
            <div
                className={cn(
                    "prose prose-sm dark:prose-invert max-w-none",
                    "prose-headings:text-lg prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2",
                    "prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400",
                    "prose-ul:my-2 prose-li:my-0.5",
                    isRTL && "text-right",
                    className
                )}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
        );
    }

    return (
        <div className={cn("space-y-3", className)} dir={isRTL ? "rtl" : "ltr"}>
            <Accordion
                type="multiple"
                defaultValue={sections.map(s => s.id)}
                className="w-full"
            >
                {sections.map((section) => (
                    <AccordionItem
                        key={section.id}
                        value={section.id}
                        className="border border-neutral-200 dark:border-neutral-200 rounded-xl mb-3 overflow-hidden bg-transparent shadow-none"
                    >
                        <AccordionTrigger
                            className={cn(
                                "px-5 py-4 hover:no-underline",
                                "text-base font-bold",
                                isRTL ? "flex-row-reverse text-right" : ""
                            )}
                        >
                            <div className={cn(
                                "flex items-center gap-3",
                                isRTL && "flex-row-reverse"
                            )}>
                                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-100">
                                    {section.icon}
                                </div>
                                <span className="text-neutral-900 dark:text-neutral-900">{section.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5 pt-0">
                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-200 to-transparent mb-4" />

                            {/* Content with enhanced typography */}
                            <div
                                className={cn(
                                    // Base prose styling
                                    "text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-600",

                                    // Headings inside content
                                    "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-neutral-800 dark:[&_h1]:text-neutral-800 [&_h1]:mt-4 [&_h1]:mb-2",
                                    "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-neutral-700 dark:[&_h2]:text-neutral-700 [&_h2]:mt-3 [&_h2]:mb-2",
                                    "[&_h3]:text-base [&_h3]:font-medium [&_h3]:text-neutral-700 dark:[&_h3]:text-neutral-700 [&_h3]:mt-2 [&_h3]:mb-1",

                                    // Paragraphs
                                    "[&_p]:mb-3 [&_p]:leading-relaxed",

                                    // Bold/strong text styling
                                    "[&_strong]:font-semibold [&_strong]:text-neutral-800 dark:[&_strong]:text-neutral-800",

                                    // Lists - styled bullets
                                    "[&_ul]:list-none [&_ul]:my-3 [&_ul]:space-y-2",
                                    "[&_ul>li]:relative [&_ul>li]:pl-5",
                                    "[&_ul>li]:before:content-['•'] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:text-amber-500 [&_ul>li]:before:font-bold",
                                    "[&_li]:text-neutral-600 dark:[&_li]:text-neutral-600 [&_li]:leading-relaxed",

                                    // Ordered lists
                                    "[&_ol]:list-decimal [&_ol]:my-3 [&_ol]:pl-5 [&_ol]:space-y-2",
                                    "[&_ol>li]:marker:text-amber-500 [&_ol>li]:marker:font-semibold",

                                    // Links
                                    "[&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-500",

                                    // RTL adjustments
                                    isRTL && "text-right [&_ul>li]:pr-5 [&_ul>li]:pl-0 [&_ul>li]:before:right-0 [&_ul>li]:before:left-auto [&_ol]:pr-5 [&_ol]:pl-0"
                                )}
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

export default ProductDescriptionAccordion;
