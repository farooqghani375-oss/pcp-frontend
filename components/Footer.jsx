import Link from 'next/link'

const SHOP_LINKS = [
  { label: 'All Products', href: '/shop'                      },
  { label: 'Plants',       href: '/shop?category=plants'      },
  { label: 'Pots',         href: '/shop?category=pots'        },
  { label: 'Tools',        href: '/shop?category=tools'       },
  { label: 'Fertilizers',  href: '/shop?category=fertilizers' },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about'   },
  { label: 'Contact',  href: '/contact' },
  { label: 'Home',     href: '/'        },
]

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white mt-10 lg:mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 lg:pt-16 pb-8">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo.jpeg" alt="Plant Center Peshawar" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide">Plant Center</p>
                <p className="text-[10px] text-green-300 uppercase tracking-widest">Peshawar</p>
              </div>
            </div>
            <p className="text-green-200 text-sm leading-relaxed max-w-xs">
              Peshawar's most trusted plant store. Quality plants, pots, and gardening essentials since 2019.
            </p>

            {/* Social */}
            <div className="flex gap-2 mt-4">
              {[
                { label: 'Facebook',  src: '/images/facebook.svg',  href: 'https://www.facebook.com/Asadk05' },
                { label: 'Instagram', src: '/images/instagram.jpeg', href: 'https://www.instagram.com/plant_center_peshawar/?hl=en' },
                { label: 'tiktok',  src: '/images/tiktok.png',  href: 'https://www.tiktok.com/@plantcenter2' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label={s.label}
                >
                  <img src={s.src} alt={s.label} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-4">Shop</p>
            <ul className="flex flex-col gap-2.5">
              {SHOP_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-green-100 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-4">Company</p>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-green-100 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-4">Get In Touch</p>
            <ul className="flex flex-col gap-2.5 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Tarnab farm , Peshawar, KPK</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+92 319 9004866</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Always open</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-green-300">
            © {new Date().getFullYear()} Plant Center Peshawar. All rights reserved.
          </p>
          <p className="text-xs text-green-300">
            Made with 🌿 in Peshawar
          </p>
        </div>
      </div>
    </footer>
  )
}
