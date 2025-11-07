import { motion } from "framer-motion"

const FeatureCard = ({ Icon, title, text, iconColor, bgHover }) => {
  return (
    <motion.div
      className={`space-y-4 flex flex-col justify-center items-center border rounded-xl shadow-lg p-8 py-12 group smooth-transition ${bgHover}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Icon size={60} className={`${iconColor} group-hover:text-black transition-all`} />
      <div className="space-y-4 group-hover:text-black transition-all">
        <h3 className="text-3xl font-bold">{title}</h3>
        <p className="max-w-78">{text}</p>
      </div>
    </motion.div>
  )
}

export default FeatureCard
