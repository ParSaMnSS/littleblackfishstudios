import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Cleanup
  await prisma.project.deleteMany({})
  await prisma.heroSlide.deleteMany({})

  // 2. Add Dummy Projects
  const projects = [
    {
      slug: "kagu-workflow-automation",
      titleEn: "KAGU Workflow Automation",
      titleFa: "اتوماسیون جریان کار کاگو",
      descEn: "A complete internal tool for managing freelance projects.",
      descFa: "یک ابزار داخلی کامل برای مدیریت پروژه‌های فریلنسری.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      published: true,
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop"
    },
    {
      slug: "smart-city-dashboard",
      titleEn: "Smart City Dashboard",
      titleFa: "داشبورد شهر هوشمند",
      descEn: "Real-time monitoring system for urban infrastructure.",
      descFa: "سیستم مانیتورینگ بلادرنگ برای زیرساخت‌های شهری.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      published: true,
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2070&auto=format&fit=crop"
    },
    {
      slug: "eco-track-mobile-app",
      titleEn: "Eco-Track Mobile App",
      titleFa: "اپلیکیشن موبایل اکو-ترک",
      descEn: "Helping users track and reduce their carbon footprint.",
      descFa: "کمک به کاربران برای ردیابی و کاهش ردپای کربن خود.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      published: true,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2070&auto=format&fit=crop"
    }
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project
    })
  }

  // 3. Add Dummy Hero Slides
  const slides = [
    {
      titleEn: "Software Solutions & Engineering",
      titleFa: "راهکارهای نرم‌افزاری و مهندسی",
      subtitleEn: "Elevating your digital presence with cutting-edge technology.",
      subtitleFa: "ارتقای حضور دیجیتال شما با فناوری‌های روز دنیا.",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      order: 1,
      active: true
    },
    {
      titleEn: "Immersive Digital Experiences",
      titleFa: "تجربیات دیجیتال فراگیر",
      subtitleEn: "We build the tools that shape the future.",
      subtitleFa: "ما ابزارهایی می‌سازیم که آینده را شکل می‌دهند.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop",
      order: 2,
      active: true
    }
  ]

  for (const slide of slides) {
    await prisma.heroSlide.create({
      data: slide
    })
  }
  
  console.log("✅ Database seeded successfully with projects and hero slides")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { 
    console.error(e); 
    await prisma.$disconnect(); 
    process.exit(1) 
  })
