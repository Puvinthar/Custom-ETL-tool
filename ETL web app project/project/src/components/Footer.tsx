import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ETL Pipeline Studio
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Professional-grade data transformation tool built for modern data teams. 
              Transform your data with confidence and precision.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                • Visual Pipeline Builder
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                • Real-time Data Preview
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                • Quality Reporting
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                • Multiple Export Formats
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                • Enterprise Performance
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400">Get Started</h4>
            <p className="text-gray-300">
              Ready to transform your data workflow? Start building your first pipeline today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              Start Free Trial
            </motion.button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-300">
            <span>Developed with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>by</span>
            <span className="font-semibold text-white">Data Science Enthusiast</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            © 2024 ETL Pipeline Studio. All rights reserved.
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;