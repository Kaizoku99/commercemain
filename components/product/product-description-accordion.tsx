"use client";

import { useMemo, useEffect, useState } from "react";
import { Sparkles, Leaf, FlaskConical, BookOpen, AlertTriangle, Info } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ProductDescriptionSection {
    id: string;
    title: string;
    displayTitle: string;
    content: string;
    icon: React.ReactNode;
    priority: number;
}

interface ProductDescriptionAccordionProps {
    descriptionHtml: string;
    className?: string;
    isRTL?: boolean;
}

// ============================================================================
// Section Configuration - Single Source of Truth
// ============================================================================

type SectionType = 'overview' | 'benefits' | 'ingredients' | 'usage' | 'disclaimer';

interface SectionConfig {
    type: SectionType;
    priority: number; // Lower = appears first
    icon: React.ReactNode;
    displayTitle: { en: string; ar: string };
    // All possible header variations (lowercase for matching)
    patterns: RegExp[];
}

const SECTION_CONFIGS: SectionConfig[] = [
    {
        type: 'overview',
        priority: 1,
        icon: <Sparkles className="w-5 h-5 text-amber-500" />,
        displayTitle: { en: 'Overview', ar: 'نظرة عامة' },
        patterns: [
            /^overview:?$/i,
            /^نظرة\s*عامة:?$/i,
            /^about:?$/i,
            /^description:?$/i,
            /^product\s*overview:?$/i,
        ],
    },
    {
        type: 'benefits',
        priority: 2,
        icon: <Sparkles className="w-5 h-5 text-amber-500" />,
        displayTitle: { en: 'Key Benefits', ar: 'الفوائد الرئيسية' },
        patterns: [
            /^key\s*benefits:?$/i,
            /^benefits:?$/i,
            /^الفوائد(\s*الرئيسية)?:?$/i,
            /^فوائد:?$/i,
            /^main\s*benefits:?$/i,
        ],
    },
    {
        type: 'ingredients',
        priority: 3,
        icon: <FlaskConical className="w-5 h-5 text-green-500" />,
        displayTitle: { en: 'Ingredients', ar: 'المكونات' },
        patterns: [
            /^ingredients:?$/i,
            /^active\s*ingredients:?$/i,
            /^key\s*ingredients:?$/i,
            /^main\s*ingredients:?$/i,
            /^المكونات(\s*الفعالة)?:?$/i,
            /^مكونات:?$/i,
        ],
    },
    {
        type: 'usage',
        priority: 4,
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        displayTitle: { en: 'How to Use', ar: 'طريقة الاستخدام' },
        patterns: [
            /^how\s*to\s*use:?$/i,
            /^usage:?$/i,
            /^directions:?$/i,
            /^instructions:?$/i,
            /^application:?$/i,
            /^طريقة\s*(الاستخدام)?:?$/i,
            /^كيفية\s*(الاستخدام)?:?$/i,
            /^الاستخدام:?$/i,
            /^استخدام:?$/i,
        ],
    },
    {
        type: 'disclaimer',
        priority: 5,
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        displayTitle: { en: 'Disclaimer', ar: 'تنويه' },
        patterns: [
            /^disclaimer:?$/i,
            /^warning:?$/i,
            /^caution:?$/i,
            /^note:?$/i,
            /^important:?$/i,
            /^تنويه:?$/i,
            /^تحذير:?$/i,
            /^ملاحظة:?$/i,
            /^هام:?$/i,
        ],
    },
];

// ============================================================================
// Smart Parser
// ============================================================================

/**
 * Identifies the section type from a header text
 * Returns null if no match found
 */
function identifySectionType(headerText: string): SectionConfig | null {
    const normalized = headerText.trim();
    
    for (const config of SECTION_CONFIGS) {
        for (const pattern of config.patterns) {
            if (pattern.test(normalized)) {
                return config;
            }
        }
    }
    
    return null;
}

/**
 * Smart HTML parser that handles:
 * 1. Headers in <strong>, <b>, <h1-h6> tags
 * 2. Headers as standalone text followed by content
 * 3. Deduplication of same section types
 * 4. Proper content attribution
 * 5. Canonical ordering
 */
function parseDescriptionHtml(
    html: string,
    isRTL: boolean
): ProductDescriptionSection[] {
    if (!html || typeof window === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Map to collect sections (key = section type, value = accumulated content)
    const sectionMap = new Map<SectionType, { config: SectionConfig; contents: string[] }>();
    
    // Track content that doesn't belong to any section (intro/overview)
    let introContent: string[] = [];
    let currentSectionType: SectionType | null = null;
    
    /**
     * Check if an element or text contains a section header
     * Returns the config if found, null otherwise
     */
    function extractHeader(text: string): SectionConfig | null {
        // Clean the text
        const cleaned = text.replace(/[:\-–—]/g, '').trim();
        return identifySectionType(cleaned);
    }
    
    /**
     * Process a single DOM node recursively
     */
    function processNode(node: Node): void {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim() || '';
            if (!text) return;
            
            // Check if this text is a header
            const headerConfig = extractHeader(text);
            if (headerConfig) {
                // This is a section header - switch context
                currentSectionType = headerConfig.type;
                if (!sectionMap.has(headerConfig.type)) {
                    sectionMap.set(headerConfig.type, { config: headerConfig, contents: [] });
                }
                return;
            }
            
            // Not a header - add to current section or intro
            if (currentSectionType) {
                const section = sectionMap.get(currentSectionType);
                if (section) {
                    section.contents.push(text);
                }
            } else {
                introContent.push(text);
            }
            return;
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const tagName = element.tagName.toLowerCase();
            
            // Check if this element IS a header (strong, b, h1-h6)
            const isHeaderElement = ['strong', 'b', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName);
            
            if (isHeaderElement) {
                const headerText = element.textContent?.trim() || '';
                const headerConfig = extractHeader(headerText);
                
                if (headerConfig) {
                    // This element is a section header
                    currentSectionType = headerConfig.type;
                    if (!sectionMap.has(headerConfig.type)) {
                        sectionMap.set(headerConfig.type, { config: headerConfig, contents: [] });
                    }
                    return; // Don't process children of header element
                }
            }
            
            // For paragraphs and divs, check if the FIRST child is a header
            if (['p', 'div'].includes(tagName)) {
                const firstTextContent = element.textContent?.trim().split('\n')[0] || '';
                const headerConfig = extractHeader(firstTextContent);
                
                if (headerConfig && firstTextContent.length < 50) {
                    // First line is likely a header
                    currentSectionType = headerConfig.type;
                    if (!sectionMap.has(headerConfig.type)) {
                        sectionMap.set(headerConfig.type, { config: headerConfig, contents: [] });
                    }
                    
                    // Get remaining content after the header
                    const fullText = element.textContent || '';
                    const remainingText = fullText.substring(firstTextContent.length).trim();
                    if (remainingText) {
                        const section = sectionMap.get(headerConfig.type);
                        if (section) {
                            section.contents.push(remainingText);
                        }
                    }
                    return;
                }
            }
            
            // Handle lists - keep them as HTML for proper rendering
            if (['ul', 'ol'].includes(tagName)) {
                const listHtml = element.outerHTML;
                if (currentSectionType) {
                    const section = sectionMap.get(currentSectionType);
                    if (section) {
                        section.contents.push(listHtml);
                    }
                } else {
                    introContent.push(listHtml);
                }
                return;
            }
            
            // Recursively process children
            element.childNodes.forEach(child => processNode(child));
        }
    }
    
    // Process all body children
    doc.body.childNodes.forEach(node => processNode(node));
    
    // Build final sections array
    const sections: ProductDescriptionSection[] = [];
    
    // Handle intro content - merge with overview section if exists, otherwise create new
    const introText = introContent.join(' ').trim();
    const overviewConfig = SECTION_CONFIGS.find(c => c.type === 'overview')!;
    
    // Check if we have an explicit overview section in the map
    const existingOverview = sectionMap.get('overview');
    
    if (existingOverview) {
        // Merge intro content into the existing overview section (intro first)
        if (introText && introText.length > 10) {
            existingOverview.contents.unshift(introText);
        }
    } else if (introText && introText.length > 20) {
        // No explicit overview section - create one from intro content
        sectionMap.set('overview', {
            config: overviewConfig,
            contents: [introText]
        });
    }
    
    // Add all detected sections from the map (no duplicates possible since it's a Map)
    sectionMap.forEach(({ config, contents }, type) => {
        const content = contents.join('\n').trim();
        if (content) {
            sections.push({
                id: `section-${type}`,
                title: type,
                displayTitle: isRTL ? config.displayTitle.ar : config.displayTitle.en,
                content: wrapInParagraphs(content),
                icon: config.icon,
                priority: config.priority,
            });
        }
    });
    
    // Sort by priority (canonical order)
    sections.sort((a, b) => a.priority - b.priority);
    
    // If no sections detected at all, return single overview
    if (sections.length === 0) {
        const overviewConfig = SECTION_CONFIGS.find(c => c.type === 'overview')!;
        return [{
            id: 'section-overview',
            title: 'overview',
            displayTitle: isRTL ? overviewConfig.displayTitle.ar : overviewConfig.displayTitle.en,
            content: html,
            icon: overviewConfig.icon,
            priority: 1,
        }];
    }
    
    return sections;
}

/**
 * Wraps plain text in paragraph tags if needed
 * Preserves existing HTML structure
 */
function wrapInParagraphs(content: string): string {
    // If content already has HTML structure, return as-is
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return content;
    }
    
    // Wrap in paragraph
    return `<p>${content}</p>`;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ProductDescriptionAccordion
 * 
 * A smart, structured accordion-based product description component that:
 * - Automatically detects and categorizes sections
 * - Deduplicates same section types (merges content)
 * - Maintains canonical ordering (Overview → Benefits → Ingredients → Usage → Disclaimer)
 * - Supports RTL for Arabic
 * - Provides visual hierarchy with icons
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

    const sections = useMemo((): ProductDescriptionSection[] => {
        if (!mounted) return [];
        return parseDescriptionHtml(descriptionHtml, isRTL);
    }, [descriptionHtml, isRTL, mounted]);

    // SSR/hydration guard - show raw HTML during SSR
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

    // If only one section or no structured content, show inline with nice formatting
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
                dangerouslySetInnerHTML={{ __html: sections[0]?.content || descriptionHtml }}
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
                                <span className="text-neutral-900 dark:text-neutral-900">{section.displayTitle}</span>
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
