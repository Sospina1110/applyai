import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
  TableRow,
  TableCell,
  Table,
  WidthType,
  convertInchesToTwip,
} from "docx";

function makeDivider() {
  return new Paragraph({
    border: {
      bottom: {
        color: "AAAAAA",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    spacing: { after: 80 },
  });
}

function makeSectionTitle(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 18,
        color: "111111",
        font: "Calibri",
      }),
    ],
    spacing: { before: 160, after: 80 },
  });
}

function makeBullet(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `• ${text}`,
        size: 18,
        font: "Calibri",
        color: "333333",
      }),
    ],
    spacing: { after: 40 },
    indent: { left: convertInchesToTwip(0.2) },
  });
}

export async function generateCV(cvData, profileText) {
  const sections = [];

  // ── NOMBRE ──────────────────────────────────────────────
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cvData.nombre.toUpperCase(),
          bold: true,
          size: 24,
          font: "Calibri",
          color: "000000",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  // ── CONTACTO ─────────────────────────────────────────────
  const contactParts = [cvData.email, cvData.telefono];
  if (cvData.linkedin) contactParts.push(`LinkedIn: ${cvData.linkedin}`);
  if (cvData.ciudad) contactParts.push(cvData.ciudad);

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          size: 17,
          font: "Calibri",
          color: "444444",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  // ── DIVIDER ──────────────────────────────────────────────
  sections.push(makeDivider());

  // ── PERFIL PROFESIONAL ───────────────────────────────────
  sections.push(makeSectionTitle("Perfil Profesional"));
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: profileText,
          size: 18,
          font: "Calibri",
          color: "333333",
        }),
      ],
      spacing: { after: 80 },
    })
  );

  // ── FORMACIÓN ACADÉMICA ──────────────────────────────────
  sections.push(makeSectionTitle("Formación Académica"));
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cvData.universidad,
          bold: true,
          size: 18,
          font: "Calibri",
          color: "111111",
        }),
        new TextRun({
          text: `  |  ${cvData.ciudad}`,
          size: 18,
          font: "Calibri",
          color: "555555",
        }),
      ],
      spacing: { after: 20 },
    })
  );
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Semestre ${cvData.semestre}  —  Graduación esperada: ${cvData.graduacion}`,
          size: 17,
          font: "Calibri",
          color: "555555",
          italics: true,
        }),
      ],
      spacing: { after: 20 },
    })
  );
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cvData.carrera,
          size: 18,
          font: "Calibri",
          color: "333333",
        }),
      ],
      spacing: { after: 80 },
    })
  );

  // ── IDIOMAS ───────────────────────────────────────────────
  if (cvData.idiomas && cvData.idiomas.length > 0) {
    sections.push(makeSectionTitle("Idiomas"));
    const idiomaTexts = cvData.idiomas.map((i) => {
      let t = `${i.idioma}: ${i.nivel}`;
      if (i.certificacion) t += ` (${i.certificacion})`;
      return t;
    });
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: idiomaTexts.join("   |   "),
            size: 18,
            font: "Calibri",
            color: "333333",
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  // ── EXPERIENCIA ───────────────────────────────────────────
  if (cvData.experiencias && cvData.experiencias.length > 0) {
    sections.push(makeSectionTitle("Experiencia"));

    for (const exp of cvData.experiencias) {
      // Título del rol
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.titulo,
              bold: true,
              size: 18,
              font: "Calibri",
              color: "111111",
            }),
            new TextRun({
              text: `  ·  ${exp.organizacion}`,
              size: 18,
              font: "Calibri",
              color: "444444",
            }),
          ],
          spacing: { before: 100, after: 20 },
        })
      );
      // Fechas
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.inicio} – ${exp.fin}`,
              size: 16,
              font: "Calibri",
              color: "777777",
              italics: true,
            }),
          ],
          spacing: { after: 40 },
        })
      );
      // Bullets de descripción
      const allBullets = [
        ...(exp.descripcion || []),
        ...(exp.logros || []),
      ];
      for (const bullet of allBullets) {
        if (bullet && bullet.trim()) {
          sections.push(makeBullet(bullet));
        }
      }
    }
  }

  // ── HABILIDADES TÉCNICAS ──────────────────────────────────
  if (cvData.habilidadesTecnicas && cvData.habilidadesTecnicas.length > 0) {
    sections.push(makeSectionTitle("Habilidades Técnicas"));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.habilidadesTecnicas.join("   ·   "),
            size: 18,
            font: "Calibri",
            color: "333333",
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  // ── HABILIDADES BLANDAS ───────────────────────────────────
  if (cvData.habilidadesBlandas && cvData.habilidadesBlandas.length > 0) {
    sections.push(makeSectionTitle("Competencias"));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.habilidadesBlandas.join("   ·   "),
            size: 18,
            font: "Calibri",
            color: "333333",
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children: sections,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
