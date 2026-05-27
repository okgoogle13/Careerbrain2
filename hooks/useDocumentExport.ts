import { RefObject } from 'react';
import { CareerDatabase, MatchAnalysis, JobOpportunity } from '../types';
import { TemplateStyle } from '../constants';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ColumnBreak } from 'docx';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';

interface UseDocumentExportProps {
  activeTab: 'resume' | 'coverLetter' | 'ksc' | 'analysis' | string;
  analysis: MatchAnalysis | null;
  careerData: CareerDatabase;
  job: JobOpportunity;
  selectedTemplate: TemplateStyle;
  coverLetterContent: string;
  resumeRef: RefObject<HTMLDivElement | null>;
  kscRef: RefObject<HTMLDivElement | null>;
}

export function useDocumentExport({
  activeTab,
  analysis,
  careerData,
  job,
  selectedTemplate,
  coverLetterContent,
  resumeRef,
  kscRef
}: UseDocumentExportProps) {
  
  const exportToPDF = (documentType?: 'resume' | 'coverLetter' | 'ksc') => {
    const target = documentType || activeTab;
    let element: HTMLElement | null = null;
    let filename = 'Document.pdf';

    if (target === 'resume' && resumeRef.current) {
      element = resumeRef.current;
      filename = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Resume_${job.Company_Name.replace(/\s+/g, '_')}.pdf`;
    } else if (target === 'ksc' && kscRef.current) {
      element = kscRef.current;
      filename = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_KSC_Responses_${job.Company_Name.replace(/\s+/g, '_')}.pdf`;
    } else if (target === 'coverLetter' && analysis) {
      element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: ${selectedTemplate.fontSans}; padding: 60px; color: ${selectedTemplate.textColor}; max-width: 800px; margin: auto; background: white; min-height: 1000px;">
          <div style="text-align: center; margin-bottom: 50px; border-bottom: 2px solid ${selectedTemplate.primaryColor}; padding-bottom: 25px;">
            <h1 style="color: ${selectedTemplate.primaryColor}; margin: 0; font-size: 32px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">${careerData.Personal_Information.FullName}</h1>
            <div style="margin-top: 12px; font-size: 13px; color: ${selectedTemplate.secondaryColor}; letter-spacing: 1px;">
              ${careerData.Personal_Information.Email} | ${careerData.Personal_Information.Phone} | ${careerData.Personal_Information.Location}
            </div>
            ${careerData.Personal_Information.Portfolio_Website_URLs?.length > 0 ? `
              <div style="margin-top: 8px; font-size: 11px; color: ${selectedTemplate.secondaryColor};">
                ${careerData.Personal_Information.Portfolio_Website_URLs.join(' | ')}
              </div>
            ` : ''}
          </div>
          <div style="margin-bottom: 40px; font-size: 14px;">
            <div style="font-weight: 600; margin-bottom: 25px; color: ${selectedTemplate.secondaryColor};">${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div style="font-weight: 700; color: ${selectedTemplate.primaryColor}; margin-bottom: 4px;">Hiring Manager</div>
            <div style="font-weight: 600;">${job.Company_Name}</div>
            <div style="color: ${selectedTemplate.secondaryColor};">${job.Location}</div>
            <div style="margin-top: 15px; font-weight: 600;">RE: ${job.Job_Title} Application</div>
          </div>
          <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; text-align: justify;">${coverLetterContent || analysis.Cover_Letter_Draft}</div>
          <div style="margin-top: 50px;">
            <div style="margin-bottom: 10px;">Sincerely,</div>
            <div style="margin-top: 20px; font-weight: 700; font-size: 16px; color: ${selectedTemplate.primaryColor}; border-top: 1px solid #eee; display: inline-block; padding-top: 10px;">${careerData.Personal_Information.FullName}</div>
          </div>
        </div>
      `;
      filename = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Cover_Letter_${job.Company_Name.replace(/\s+/g, '_')}.pdf`;
    }

    if (element) {
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const getFullResumeText = () => {
    if (!analysis) return '';
    let md = `${careerData.Personal_Information.FullName}\n\n`;
    md += `Email: ${careerData.Personal_Information.Email} | Phone: ${careerData.Personal_Information.Phone} | Location: ${careerData.Personal_Information.Location}\n\n`;
    md += `Professional Summary\n${analysis.Tailored_Summary}\n\n`;
    md += `Professional Experience\n`;
    
    const workEntries = careerData.Career_Entries.filter(e => e.Entry_Type === "Work Experience")
      .sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

    workEntries.forEach(entry => {
      const entryAchievements = careerData.Structured_Achievements.filter(a => a.Entry_ID === entry.Entry_ID);
      if (entryAchievements.length > 0) {
        md += `${entry.Role}\n${entry.Organization} | ${entry.StartDate} - ${entry.EndDate}\n\n`;
        entryAchievements.forEach(ach => {
          md += `- ${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}.\n`;
        });
        md += '\n';
      }
    });
    
    md += `Skills\n${careerData.Master_Skills_Inventory.map(s => s.Skill_Name).join(', ')}\n`;
    return md;
  };

  const exportToMarkdown = (documentType?: 'resume' | 'coverLetter' | 'ksc') => {
    const target = documentType || activeTab;
    let filename = 'Document.md';
    
    if (target === 'resume' && analysis) {
      const md = getFullResumeText();
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      filename = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Resume_${job.Company_Name.replace(/\s+/g, '_')}.md`;
      saveAs(blob, filename);
    } else if (target === 'coverLetter' && analysis) {
      let md = `# Cover Letter for ${job.Job_Title} at ${job.Company_Name}\n\n`;
      md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
      md += `${coverLetterContent || analysis.Cover_Letter_Draft}\n\n`;
      md += `---\nGenerated by Career Copilot`;
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      filename = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Cover_Letter_${job.Company_Name.replace(/\s+/g, '_')}.md`;
      saveAs(blob, filename);
    } else if (target === 'ksc' && analysis.KSC_Responses_Drafts) {
      let md = `# Key Selection Criteria Responses\n`;
      md += `**Target:** ${job.Job_Title} at ${job.Company_Name}\n\n`;
      analysis.KSC_Responses_Drafts.forEach((ksc, i) => {
        md += `## Criterion ${i + 1}: ${ksc.KSC_Prompt}\n\n${ksc.Response}\n\n`;
      });
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      filename = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_KSC_Responses_${job.Company_Name.replace(/\s+/g, '_')}.md`;
      saveAs(blob, filename);
    }
  };

  const exportToDOCX = async (documentType?: 'resume' | 'coverLetter' | 'ksc') => {
    const target = documentType || activeTab;
    if (target === 'resume' && analysis) {
      const isTwoColumn = selectedTemplate.layout === 'two-column';
      
      const headerContent = [
        new Paragraph({
          text: careerData.Personal_Information.FullName,
          heading: HeadingLevel.HEADING_1,
          alignment: "center",
        }),
        new Paragraph({
          alignment: "center",
          children: [
            new TextRun({
              text: `${careerData.Personal_Information.Email} | ${careerData.Personal_Information.Phone} | ${careerData.Personal_Information.Location}`,
              size: 20,
            }),
          ],
        }),
        ...(careerData.Personal_Information.Portfolio_Website_URLs?.length > 0 ? [
          new Paragraph({
            alignment: "center",
            children: [
              new TextRun({
                text: careerData.Personal_Information.Portfolio_Website_URLs.join(' | '),
                size: 18,
                bold: true,
              }),
            ],
          })
        ] : []),
        new Paragraph({ text: "" }),
      ];

      const leftColumnContent = [
        ...(analysis.Headline_Suggestion ? [
          new Paragraph({
            text: analysis.Headline_Suggestion,
            heading: HeadingLevel.HEADING_2,
            alignment: "center",
          }),
          new Paragraph({ text: "" }),
        ] : []),
        new Paragraph({
          text: "Professional Summary",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: analysis.Tailored_Summary,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Professional Experience",
          heading: HeadingLevel.HEADING_2,
        }),
        ...careerData.Career_Entries.filter(e => e.Entry_Type === "Work Experience")
          .sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime())
          .flatMap(entry => {
            const entryAchievements = careerData.Structured_Achievements.filter(a => a.Entry_ID === entry.Entry_ID);
            
            // Sort achievements to put recommended ones first
            const sortedAchievements = [...entryAchievements].sort((a, b) => {
              const aRec = analysis.Recommended_Achievement_IDs.includes(a.Achievement_ID);
              const bRec = analysis.Recommended_Achievement_IDs.includes(b.Achievement_ID);
              if (aRec && !bRec) return -1;
              if (!aRec && bRec) return 1;
              return 0;
            });

            return [
              new Paragraph({
                children: [
                  new TextRun({ text: entry.Role, bold: true, size: 24 }),
                  new TextRun({ text: `\t${entry.StartDate} - ${entry.EndDate}`, size: 20 }),
                ],
                tabStops: [{ type: "right", position: 9000 }],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: entry.Organization, italics: true, size: 22 }),
                  new TextRun({ text: ` | ${entry.Location}`, size: 20 }),
                ],
                spacing: { after: 120 },
              }),
              ...sortedAchievements.map(ach => new Paragraph({
                children: [
                  new TextRun({ 
                    text: `${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}.`,
                    bold: analysis.Recommended_Achievement_IDs.includes(ach.Achievement_ID)
                  })
                ],
                bullet: { level: 0 },
                spacing: { before: 40, after: 40 },
              })),
              new Paragraph({ text: "" })
            ];
          }),
        // Volunteering Section
        ...(careerData.Career_Entries.some(e => e.Entry_Type === "Volunteer") ? [
          new Paragraph({
            text: "Volunteering & Community",
            heading: HeadingLevel.HEADING_2,
          }),
          ...careerData.Career_Entries.filter(e => e.Entry_Type === "Volunteer")
            .flatMap(entry => [
              new Paragraph({
                children: [
                  new TextRun({ text: entry.Role, bold: true, size: 22 }),
                  new TextRun({ text: ` | ${entry.Organization}`, italics: true, size: 20 }),
                ],
              }),
              new Paragraph({
                text: entry.Core_Responsibilities_Scope,
                spacing: { after: 120 },
              })
            ])
        ] : []),
        // Projects Section
        ...(careerData.Career_Entries.some(e => e.Entry_Type === "Project") ? [
          new Paragraph({
            text: "Key Projects",
            heading: HeadingLevel.HEADING_2,
          }),
          ...careerData.Career_Entries.filter(e => e.Entry_Type === "Project")
            .flatMap(entry => [
              new Paragraph({
                children: [
                  new TextRun({ text: entry.Role, bold: true, size: 22 }),
                  new TextRun({ text: ` | ${entry.Organization}`, italics: true, size: 20 }),
                ],
              }),
              new Paragraph({
                text: entry.Core_Responsibilities_Scope,
                spacing: { after: 120 },
              })
            ])
        ] : [])
      ];

      const rightColumnContent = [
        new Paragraph({
          text: "Core Competencies",
          heading: HeadingLevel.HEADING_2,
        }),
        ...careerData.Master_Skills_Inventory
          .filter(s => s.Proficiency === 'Expert' || s.Proficiency === 'Master' || s.Proficiency === 'Proficient')
          .slice(0, 20)
          .map(skill => new Paragraph({
            text: skill.Skill_Name,
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
          })),
        new Paragraph({ text: "" }),
        new Paragraph({
          text: "Education",
          heading: HeadingLevel.HEADING_2,
        }),
        ...careerData.Career_Entries.filter(e => e.Entry_Type === "Education")
          .map(entry => new Paragraph({
            children: [
              new TextRun({ text: entry.Role, bold: true, size: 22 }),
              new TextRun({ text: `\n${entry.Organization}`, size: 20 }),
              new TextRun({ text: `\n${entry.EndDate}`, size: 18, italics: true }),
            ],
            spacing: { after: 120 },
          })),
        // Certifications
        ...(careerData.Career_Entries.some(e => e.Entry_Type === "Certification") ? [
          new Paragraph({
            text: "Certifications",
            heading: HeadingLevel.HEADING_2,
          }),
          ...careerData.Career_Entries.filter(e => e.Entry_Type === "Certification")
            .map(entry => new Paragraph({
              children: [
                new TextRun({ text: entry.Role, bold: true, size: 20 }),
                new TextRun({ text: ` - ${entry.Organization}`, size: 18 }),
              ],
            }))
        ] : [])
      ];

      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: selectedTemplate.fontSans.split(',')[0].trim(),
                size: 22, // 11pt
              },
            },
          },
        },
        sections: [{
          properties: isTwoColumn ? {
            column: {
              count: 2,
              space: 720, // 0.5 inch
            }
          } : {},
          children: isTwoColumn 
            ? [...headerContent, ...leftColumnContent, new Paragraph({ children: [new ColumnBreak()] }), ...rightColumnContent] 
            : [...headerContent, ...leftColumnContent, ...rightColumnContent],
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Resume_${job.Company_Name.replace(/\s+/g, '_')}.docx`);
    } else if (target === 'coverLetter' && analysis) {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: careerData.Personal_Information.FullName,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: `${careerData.Personal_Information.Email} | ${careerData.Personal_Information.Phone}`,
            }),
            new Paragraph({
              text: careerData.Personal_Information.Location,
              spacing: { after: 200 },
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({ text: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), size: 22 })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Hiring Manager", bold: true, size: 22 })
              ],
            }),
            new Paragraph({ text: job.Company_Name }),
            new Paragraph({ text: job.Location, spacing: { after: 200 } }),
            new Paragraph({
              children: [
                new TextRun({ text: `RE: ${job.Job_Title} Application`, bold: true, size: 22 })
              ],
              spacing: { after: 400 }
            }),
            ...(coverLetterContent || analysis.Cover_Letter_Draft || "").split('\n').map(line => new Paragraph({ 
              text: line,
              spacing: { after: 120 }
            })),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Sincerely," }),
            new Paragraph({
              children: [
                new TextRun({ text: careerData.Personal_Information.FullName, bold: true, size: 22 })
              ],
            }),
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Cover_Letter_${job.Company_Name.replace(/\s+/g, '_')}.docx`);
    } else if (target === 'ksc' && analysis.KSC_Responses_Drafts) {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: `Key Selection Criteria Responses`,
              heading: HeadingLevel.HEADING_1,
              alignment: "center",
            }),
            new Paragraph({
              text: `For ${job.Job_Title} at ${job.Company_Name}`,
              alignment: "center",
              spacing: { after: 400 },
            }),
            ...analysis.KSC_Responses_Drafts.flatMap((ksc, i) => [
              new Paragraph({ 
                text: `Criterion ${i + 1}: ${ksc.KSC_Prompt}`, 
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
              }),
              ...ksc.Response.split('\n').map(line => new Paragraph({ 
                text: line, 
                spacing: { after: 120 } 
              })),
              new Paragraph({ text: "" })
            ])
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_KSC_Responses_${job.Company_Name.replace(/\s+/g, '_')}.docx`);
    }
  };

  const exportToGoogleDoc = async (documentType?: 'resume' | 'coverLetter') => {
    const target = documentType || activeTab;
    let title = '';
    let content = '';

    if (target === 'resume' && analysis) {
      title = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Resume_${job.Company_Name.replace(/\s+/g, '_')}`;
      content = getFullResumeText();
    } else if (target === 'coverLetter' && analysis) {
      title = `${careerData.Personal_Information.FullName.replace(/\s+/g, '_')}_Cover_Letter_${job.Company_Name.replace(/\s+/g, '_')}`;
      content = coverLetterContent || analysis.Cover_Letter_Draft || "";
    } else {
      return;
    }

    try {
      const res = await fetch("/api/docs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      if (data.documentId) {
        alert(`Successfully exported to Google Docs! Document ID: ${data.documentId}\nYou can find it in your Google Drive.`);
      } else {
        alert(`Failed to export: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert("Error exporting to Google Docs");
      console.error(err);
    }
  };

  return { exportToPDF, exportToMarkdown, exportToDOCX, getFullResumeText, exportToGoogleDoc };
}
