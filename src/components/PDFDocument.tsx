import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { KitchenVariant, ClientInfo, RoomData } from '@/lib/types'

Font.register({
  family: 'Helvetica',
  fonts: [],
})

const palette = {
  dark: '#1c1917',
  stone: '#44403c',
  warm: '#78716c',
  light: '#f5f5f4',
  white: '#ffffff',
  amber: '#d97706',
  border: '#e7e5e4',
}

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: palette.white },

  // Cover
  cover: { backgroundColor: palette.dark, flex: 1, padding: 60 },
  coverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 11, color: palette.amber, letterSpacing: 3, textTransform: 'uppercase' },
  coverDivider: { borderBottom: `1px solid ${palette.amber}`, marginTop: 32, marginBottom: 48, width: 60 },
  coverTitle: { fontSize: 36, color: palette.white, fontWeight: 'bold', lineHeight: 1.25, marginBottom: 8 },
  coverSubtitle: { fontSize: 14, color: palette.warm, marginBottom: 48 },
  coverMeta: { marginTop: 'auto' },
  coverMetaRow: { flexDirection: 'row', marginBottom: 10 },
  coverMetaLabel: { fontSize: 9, color: palette.warm, width: 100, letterSpacing: 1, textTransform: 'uppercase' },
  coverMetaValue: { fontSize: 9, color: palette.light },

  // Section header
  sectionPage: { padding: 48, flex: 1 },
  sectionNumber: { fontSize: 60, color: palette.border, fontWeight: 'bold', lineHeight: 1 },
  sectionTitle: { fontSize: 22, color: palette.dark, fontWeight: 'bold', marginBottom: 4 },
  sectionSubtitle: { fontSize: 11, color: palette.warm, marginBottom: 32 },
  divider: { borderBottom: `1px solid ${palette.border}`, marginVertical: 20 },

  // Variant page
  variantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  variantNumber: { fontSize: 9, color: palette.amber, letterSpacing: 2, textTransform: 'uppercase' },
  variantName: { fontSize: 22, color: palette.dark, fontWeight: 'bold' },
  variantLayout: { fontSize: 9, color: palette.warm, marginTop: 2 },
  renderImage: { width: '100%', height: 280, objectFit: 'cover', borderRadius: 4 },
  renderPlaceholder: {
    width: '100%', height: 280, backgroundColor: palette.light,
    borderRadius: 4, justifyContent: 'center', alignItems: 'center',
  },
  renderPlaceholderText: { fontSize: 14, color: palette.warm },

  // Two-column specs
  specColumns: { flexDirection: 'row', gap: 24, marginTop: 20 },
  specCol: { flex: 1 },
  specItem: { marginBottom: 14 },
  specLabel: { fontSize: 8, color: palette.amber, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 },
  specValue: { fontSize: 10, color: palette.stone },

  // Features chips
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  featureChip: {
    backgroundColor: palette.light, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: palette.border,
  },
  featureText: { fontSize: 8, color: palette.stone },

  // Description
  descriptionText: { fontSize: 10, color: palette.stone, lineHeight: 1.6, marginTop: 12 },

  // Price badge
  priceBadge: {
    backgroundColor: palette.dark, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 4, alignSelf: 'flex-start',
  },
  priceLabel: { fontSize: 7, color: palette.amber, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  priceValue: { fontSize: 14, color: palette.white, fontWeight: 'bold' },

  // Calculation table
  tableHeader: { flexDirection: 'row', backgroundColor: palette.dark, padding: '8 12', borderRadius: 4, marginBottom: 1 },
  tableRow: { flexDirection: 'row', padding: '7 12', borderBottomWidth: 1, borderBottomColor: palette.border },
  tableRowAlt: { flexDirection: 'row', padding: '7 12', backgroundColor: palette.light, borderBottomWidth: 1, borderBottomColor: palette.border },
  tableColCategory: { fontSize: 8, color: palette.light, fontWeight: 'bold', width: 140 },
  tableColDesc: { fontSize: 8, flex: 1, color: palette.light },
  tableColQty: { fontSize: 8, color: palette.light, width: 50, textAlign: 'right' },
  tableColPrice: { fontSize: 8, color: palette.light, width: 80, textAlign: 'right' },
  tableDataCategory: { fontSize: 9, color: palette.stone, width: 140 },
  tableDataDesc: { fontSize: 9, color: palette.warm, flex: 1 },
  tableDataQty: { fontSize: 9, color: palette.stone, width: 50, textAlign: 'right' },
  tableDataPrice: { fontSize: 9, color: palette.stone, width: 80, textAlign: 'right', fontWeight: 'bold' },
  tableTotalRow: { flexDirection: 'row', padding: '10 12', backgroundColor: palette.amber, marginTop: 2, borderRadius: 4 },
  tableTotalLabel: { fontSize: 10, color: palette.white, fontWeight: 'bold', flex: 1 },
  tableTotalValue: { fontSize: 10, color: palette.white, fontWeight: 'bold' },

  // Timeline
  timelineItem: { flexDirection: 'row', marginBottom: 14 },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: palette.amber,
    justifyContent: 'center', alignItems: 'center', marginRight: 14, marginTop: 2,
  },
  timelineDotText: { fontSize: 10, color: palette.white, fontWeight: 'bold' },
  timelineContent: { flex: 1 },
  timelinePhaseName: { fontSize: 11, color: palette.dark, fontWeight: 'bold', marginBottom: 2 },
  timelineDuration: { fontSize: 9, color: palette.amber, marginBottom: 3 },
  timelineDesc: { fontSize: 9, color: palette.warm, lineHeight: 1.5 },

  // Footer
  footer: {
    position: 'absolute', bottom: 24, left: 48, right: 48,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: palette.border, paddingTop: 10,
  },
  footerBrand: { fontSize: 8, color: palette.warm },
  footerPage: { fontSize: 8, color: palette.warm },
})

function Footer({ brand, page }: { brand: string; page: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerBrand}>FEDOR INTERIORS — {brand}</Text>
      <Text style={styles.footerPage}>{page}</Text>
    </View>
  )
}

function CoverPage({ clientInfo, roomData, variantCount }: {
  clientInfo: ClientInfo
  roomData: RoomData
  variantCount: number
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.cover}>
        <View style={styles.coverTop}>
          <Text style={styles.brand}>Fedor Interiors</Text>
          <Text style={[styles.brand, { color: palette.warm }]}>Dizajn Kuhinja</Text>
        </View>
        <View style={styles.coverDivider} />
        <Text style={styles.coverTitle}>{clientInfo.projectName || 'Kuhinja — Dizajn Prijedlog'}</Text>
        <Text style={styles.coverSubtitle}>
          {variantCount} varijant{variantCount === 1 ? 'a' : 'i'} dizajna · {roomData.area.toFixed(1)} m² · {roomData.dimensions.width} × {roomData.dimensions.length} cm
        </Text>

        <View style={styles.coverMeta}>
          {clientInfo.clientName ? (
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Klijent</Text>
              <Text style={styles.coverMetaValue}>{clientInfo.clientName}</Text>
            </View>
          ) : null}
          {clientInfo.projectAddress ? (
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Adresa</Text>
              <Text style={styles.coverMetaValue}>{clientInfo.projectAddress}</Text>
            </View>
          ) : null}
          {clientInfo.designerName ? (
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Dizajner</Text>
              <Text style={styles.coverMetaValue}>{clientInfo.designerName}</Text>
            </View>
          ) : null}
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Datum</Text>
            <Text style={styles.coverMetaValue}>{clientInfo.date}</Text>
          </View>
        </View>
      </View>
    </Page>
  )
}

function VariantPage({ variant, index }: { variant: KitchenVariant; index: number }) {
  const totalCost = variant.estimatedCost.breakdown.reduce((sum, item) => sum + item.estimatedCost * item.quantity, 0)
  const currency = variant.estimatedCost.currency

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sectionPage}>
        <View style={styles.variantHeader}>
          <View>
            <Text style={styles.variantNumber}>VARIJANTA {index + 1}</Text>
            <Text style={styles.variantName}>{variant.name}</Text>
            <Text style={styles.variantLayout}>{variant.layout.replace('-', ' ')} · {variant.style}</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceLabel}>Procjenjena cijena</Text>
            <Text style={styles.priceValue}>
              {variant.estimatedCost.min.toLocaleString()} – {variant.estimatedCost.max.toLocaleString()} {currency}
            </Text>
          </View>
        </View>

        {/* Render */}
        {variant.renderUrl ? (
          <Image src={variant.renderUrl} style={styles.renderImage} />
        ) : (
          <View style={styles.renderPlaceholder}>
            <Text style={styles.renderPlaceholderText}>{variant.name}</Text>
          </View>
        )}

        {/* Description */}
        <Text style={styles.descriptionText}>{variant.description}</Text>

        {/* Specs */}
        <View style={styles.specColumns}>
          <View style={styles.specCol}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Korpusi i frontovi</Text>
              <Text style={styles.specValue}>{variant.cabinets.material} — {variant.cabinets.color}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Radna ploča</Text>
              <Text style={styles.specValue}>{variant.countertop.material} — {variant.countertop.color}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Pod</Text>
              <Text style={styles.specValue}>{variant.flooring.material} — {variant.flooring.color}</Text>
            </View>
          </View>
          <View style={styles.specCol}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Ugradbeni uređaji</Text>
              <Text style={styles.specValue}>
                {variant.appliances.slice(0, 4).map(a => a.name).join(', ')}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Rasvjeta</Text>
              <Text style={styles.specValue}>{variant.lighting.ambient}</Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          {variant.features.map((f, i) => (
            <View key={i} style={styles.featureChip}>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
      <Footer brand={variant.name} page={`${index + 2}`} />
    </Page>
  )
}

function CalculationPage({ variant, index }: { variant: KitchenVariant; index: number }) {
  const total = variant.estimatedCost.breakdown.reduce(
    (sum, item) => sum + item.estimatedCost * item.quantity,
    0
  )
  const vat = total * 0.17
  const totalWithVat = total + vat
  const currency = variant.estimatedCost.currency

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sectionPage}>
        <Text style={styles.sectionNumber}>€</Text>
        <Text style={styles.sectionTitle}>Kalkulacija — {variant.name}</Text>
        <Text style={styles.sectionSubtitle}>Procjena troškova po stavkama</Text>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableColCategory}>Kategorija</Text>
          <Text style={styles.tableColDesc}>Opis</Text>
          <Text style={styles.tableColQty}>Jed.</Text>
          <Text style={styles.tableColPrice}>Iznos</Text>
        </View>

        {variant.estimatedCost.breakdown.map((item, i) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.tableDataCategory}>{item.category}</Text>
            <Text style={styles.tableDataDesc}>{item.description} ({item.quantity} {item.unit})</Text>
            <Text style={styles.tableDataQty}>{item.unit}</Text>
            <Text style={styles.tableDataPrice}>
              {(item.estimatedCost * item.quantity).toLocaleString()} {currency}
            </Text>
          </View>
        ))}

        {/* Subtotals */}
        <View style={[styles.tableRow, { backgroundColor: palette.light }]}>
          <Text style={[styles.tableDataCategory, { fontWeight: 'bold' }]}>Međuzbir</Text>
          <Text style={styles.tableDataDesc}> </Text>
          <Text style={styles.tableDataQty}> </Text>
          <Text style={[styles.tableDataPrice, { fontWeight: 'bold' }]}>
            {total.toLocaleString()} {currency}
          </Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: palette.light }]}>
          <Text style={styles.tableDataCategory}>PDV (17%)</Text>
          <Text style={styles.tableDataDesc}> </Text>
          <Text style={styles.tableDataQty}> </Text>
          <Text style={styles.tableDataPrice}>{vat.toLocaleString()} {currency}</Text>
        </View>

        <View style={styles.tableTotalRow}>
          <Text style={styles.tableTotalLabel}>UKUPNO SA PDV-om</Text>
          <Text style={styles.tableTotalValue}>{totalWithVat.toLocaleString()} {currency}</Text>
        </View>

        <Text style={[styles.descriptionText, { marginTop: 16, fontSize: 8, color: palette.warm }]}>
          * Kalkulacija je okvirna procjena. Finalna cijena zavisi od konkretnih izbora materijala i uređaja.
          Cijena uključuje isporuku i montažu unutar 50km.
        </Text>
      </View>
      <Footer brand={`Kalkulacija — ${variant.name}`} page={`${index * 2 + 3}`} />
    </Page>
  )
}

function TimelinePage({ variant, index }: { variant: KitchenVariant; index: number }) {
  const sorted = [...variant.timeline].sort((a, b) => a.order - b.order)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sectionPage}>
        <Text style={styles.sectionNumber}>⏱</Text>
        <Text style={styles.sectionTitle}>Dinamika Izrade — {variant.name}</Text>
        <Text style={styles.sectionSubtitle}>Faze projekta i vremenski okviri</Text>

        {sorted.map((phase) => (
          <View key={phase.order} style={styles.timelineItem}>
            <View style={styles.timelineDot}>
              <Text style={styles.timelineDotText}>{phase.order}</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelinePhaseName}>{phase.name}</Text>
              <Text style={styles.timelineDuration}>{phase.duration}</Text>
              <Text style={styles.timelineDesc}>{phase.description}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.priceBadge, { marginTop: 24, alignSelf: 'flex-start' }]}>
          <Text style={styles.priceLabel}>Ukupno trajanje</Text>
          <Text style={[styles.priceValue, { fontSize: 11 }]}>
            {sorted.reduce((_, phase) => phase.duration, sorted[sorted.length - 1]?.duration ?? '')}
          </Text>
        </View>
      </View>
      <Footer brand={`Dinamika — ${variant.name}`} page={`${index * 2 + 4}`} />
    </Page>
  )
}

interface PDFProps {
  variants: KitchenVariant[]
  clientInfo: ClientInfo
  roomData: RoomData
  sketchBase64?: string
}

export function KitchenPDFDocument({ variants, clientInfo, roomData }: PDFProps) {
  return (
    <Document
      title={clientInfo.projectName || 'Fedor Interiors — Kuhinja'}
      author={clientInfo.designerName || 'Fedor Interiors'}
      creator="Fedor Kitchen Design"
    >
      <CoverPage clientInfo={clientInfo} roomData={roomData} variantCount={variants.length} />

      {variants.map((variant, i) => (
        <React.Fragment key={variant.id}>
          <VariantPage variant={variant} index={i} />
          <CalculationPage variant={variant} index={i} />
          <TimelinePage variant={variant} index={i} />
        </React.Fragment>
      ))}
    </Document>
  )
}
