const Produit = require('../models/Produit');
const Promotion = require('../models/Promotion');

exports.getCarte = async (req, res) => {
    try {
        const now = new Date();
        const produits = await Produit.find().lean();

        const promosActives = await Promotion.find({
            dateDebut: { $lte: now },
            dateFin: { $gte: now }
        }).lean();

        const carte = produits.map(produit => {
           
            const promoMatch = promosActives.find(p => 
                p.produits.some(id => id.toString() === produit._id.toString())
            );

            if (promoMatch) {
                const remise = (produit.prix * promoMatch.tauxReduction) / 100;
                return {
                    ...produit,
                    enPromotion: true,
                    taux: promoMatch.tauxReduction,
                    prixOriginal: produit.prix,
                    prixPromotion: Math.round((produit.prix - remise) * 100) / 100, // Arrondi 2 décimales
                    nomPromo: promoMatch.nom
                };
            }

            return { 
                ...produit, 
                enPromotion: false,
                prixOriginal: produit.prix 
            };
        });

        res.status(200).json(carte);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul de la carte", error: error.message });
    }
};