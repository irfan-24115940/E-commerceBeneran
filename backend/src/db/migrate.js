require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('../utils/db');

async function migrate() {
  try {
    // eslint-disable-next-line no-console
    console.log('🔄 Starting database migration...');

    // Step 1: Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // eslint-disable-next-line no-console
    console.log('📝 Executing schema.sql...');
    await pool.query(schemaSql);
    // eslint-disable-next-line no-console
    console.log('✅ Schema created successfully');

    // Step 2: Handle legacy columns and missing fields (non-destructive)
    // eslint-disable-next-line no-console
    console.log('🔍 Checking for missing columns...');

    try {
      const hasIsActive = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name='products'
              AND column_name='is_active'
        ) AS exists;
      `);

      if (!hasIsActive.rows[0].exists) {
        // eslint-disable-next-line no-console
        console.log('⚠️  Adding is_active column to products table...');
        await pool.query(`
          ALTER TABLE products ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
        `);
        // eslint-disable-next-line no-console
        console.log('✅ is_active column added');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('⚠️  Could not add is_active column:', e && e.message);
    }

    try {
      const hasSlugColumn = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name='categories'
              AND column_name='slug'
        ) AS exists;
      `);

      if (hasSlugColumn.rows[0].exists) {
        // eslint-disable-next-line no-console
        console.log('⚠️  Legacy slug column detected, handling safely...');
        try {
          await pool.query(`ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_slug_key;`).catch(() => {});
          await pool.query(`ALTER TABLE categories ALTER COLUMN slug DROP NOT NULL;`).catch(() => {});
          // eslint-disable-next-line no-console
          console.log('✅ Legacy slug column handled');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('⚠️  Could not fully migrate legacy schema:', e && e.message);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('⚠️  Could not check for slug column:', e && e.message);
    }

    // Step 3: Seed all categories (idempotent)
    // eslint-disable-next-line no-console
    console.log('🌱 Seeding categories...');
    await pool.query(`
      INSERT INTO categories (key, name, description)
      VALUES
        ('hoodie',         'Hoodie',         'Hoodie oversize, zipper, crop, dan streetwear premium untuk tampilan kasual kekinian.'),
        ('kaos',           'Kaos',           'Kaos polos, grafis, polo, couple, dan berbagai pilihan dengan bahan berkualitas.'),
        ('celana',         'Celana',         'Celana chinos, jeans, cargo, kulot, dan berbagai model untuk berbagai kesempatan.'),
        ('workshirt',      'Workshirt',      'Kemeja workshirt kanvas dan flanel yang kokoh dan stylish.'),
        ('pakaian-muslim', 'Pakaian Muslim', 'Gamis, Abaya, Hijab, Mukena, dan berbagai pakaian muslim berkualitas tinggi.'),
        ('topi',           'Topi',           'Topi baseball, beanie, dan berbagai aksesoris kepala.')
      ON CONFLICT (key) DO NOTHING;
    `);
    // eslint-disable-next-line no-console
    console.log('✅ Categories seeded');

    // Step 4: Seed products (only if table is empty)
    // eslint-disable-next-line no-console
    console.log('🌱 Seeding products...');
    const prodCountResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const prodCount = Number(prodCountResult.rows[0].count);

    if (prodCount === 0) {
      // eslint-disable-next-line no-console
      console.log('📊 Products table is empty, seeding 14 products...');

      const productSeed = [
        {
          title: 'MIST.CO Essential Hoodie Black',
          category: 'hoodie',
          price: 350000,
          image: 'https://media-assets.grailed.com/prd/listing/temp/8b2565172c4d4a15ad6e041b08509842?auto=format',
          description: 'Hoodie premium dengan bahan cotton fleece yang tebal dan nyaman dipakai.',
          stock: 50
        },
        {
          title: 'MIST.CO Oversized T-Shirt White',
          category: 'kaos',
          price: 150000,
          image: 'https://www.thebtclub.com/cdn/shop/files/WHITE-JPG-NEW_8c26092e-a517-41e9-82fd-dbf7e7fdaffc_800x.jpg?v=1704977164',
          description: 'Kaos oversized berbahan cotton combed 24s, cocok untuk gaya streetwear.',
          stock: 80
        },
        {
          title: 'MIST.CO Cargo Pants Olive',
          category: 'celana',
          price: 280000,
          image: 'https://feature.com/cdn/shop/files/Cargo-Pants---Olive-Drab-HM27PT001-OLD-04-10-24-Feature-KN.jpg?v=1712877351&width=640',
          description: 'Celana cargo dengan banyak saku, material twill yang kuat.',
          stock: 40
        },
        {
          title: 'MIST.CO Canvas Workshirt Navy',
          category: 'workshirt',
          price: 220000,
          image: 'https://down-id.img.susercontent.com/file/id-11134207-7r98p-lpz2lpje7bp481',
          description: 'Kemeja workshirt kanvas yang kokoh namun tidak panas saat dikenakan.',
          stock: 35
        },
        {
          title: 'MIST.CO Oversized T-Shirt Black',
          category: 'kaos',
          price: 120000,
          image: 'https://slatehash.com/cdn/shop/products/VG-SH-46202792.jpg?v=1675584596',
          description: 'Kaos oversized hitam, essential streetwear untuk lemari pakaian kamu.',
          stock: 90
        },
        {
          title: 'MIST.CO Zip-Up Hoodie Grey',
          category: 'hoodie',
          price: 380000,
          image: 'https://th.bing.com/th/id/R.a6be3f11cfc9a6d84e1e38fc3dd9b456?rik=LamHklQuLVFtbA&riu=http%3a%2f%2fcache.mrporter.com%2fvariants%2fimages%2f43769801096946203%2fin%2fw2000_q60.jpg&ehk=c7BIXTjJrGPVvYgqHQMLdM%2bZ8T3Qqk4PTL84yBIKa24%3d&risl=&pid=ImgRaw&r=0',
          description: 'Hoodie dengan ritsleting depan, praktis dan stylish.',
          stock: 30
        },
        {
          title: 'MIST.CO Denim Pants Blue',
          category: 'celana',
          price: 320000,
          image: 'https://cdn.shopify.com/s/files/1/0417/4987/2806/files/PF24_DENIM_04_PANTS_BLUE_01_192cd3af-bbc7-4cb7-9cdc-0ae3c43d2bc7.jpg?v=1713974679&width=1988',
          description: 'Celana jeans reguler fit yang nyaman untuk aktivitas sehari-hari.',
          stock: 45
        },
        {
          title: 'MIST.CO Flannel Workshirt Red/Black',
          category: 'workshirt',
          price: 250000,
          image: 'https://corlection.com/cdn/shop/articles/L1007822_1500x1002.jpg?v=1680230127',
          description: 'Kemeja flanel klasik dengan paduan warna merah dan hitam.',
          stock: 25
        },
        {
          title: "MIST.CO Graphic T-Shirt 'Street'",
          category: 'kaos',
          price: 160000,
          image: 'https://i.pinimg.com/originals/9b/c5/43/9bc54338d76caaf757589b838e774291.jpg',
          description: 'Kaos dengan sablon grafis bertema street culture.',
          stock: 60
        },
        {
          title: 'MIST.CO Sweatpants Black',
          category: 'celana',
          price: 200000,
          image: 'https://studios-tc.com/wp-content/uploads/2022/09/oversize-sweatpants-black-front.jpg',
          description: 'Celana training nyaman untuk olahraga atau bersantai.',
          stock: 55
        },
        {
          title: 'MIST.CO Kurta Modern Black',
          category: 'pakaian-muslim',
          price: 275000,
          image: 'https://i.pinimg.com/originals/31/81/bb/3181bb0eebaea0aacb7fa240b738002c.jpg',
          description: 'Baju koko model kurta modern dengan bahan katun toyobo yang adem.',
          stock: 20
        },
        {
          title: 'MIST.CO Longline Koko White',
          category: 'pakaian-muslim',
          price: 250000,
          image: 'https://down-id.img.susercontent.com/file/id-11134201-7r98p-ltf2vxu6lcp76c',
          description: 'Koko putih berpotongan panjang yang elegan untuk acara keagamaan.',
          stock: 15
        },
        {
          title: 'MIST.CO Classic Baseball Cap Black',
          category: 'topi',
          price: 95000,
          image: 'https://static.vecteezy.com/system/resources/previews/050/024/970/large_2x/classic-baseball-cap-solid-black-front-view-isolated-on-a-white-background-highresolution-suitable-for-fashion-catalogs-free-photo.jpg',
          description: 'Topi baseball klasik berwarna hitam dengan bordir logo minimalis.',
          stock: 70
        },
        {
          title: 'MIST.CO Vintage Beanie Grey',
          category: 'topi',
          price: 85000,
          image: 'https://cdn.clothbase.com/uploads/d127897c-691e-4cc3-b052-2b50122694f4/wb_eyJidWNrZXQiOiJic3RuLWltYWdlLXNlcnZlciIs.jpg',
          description: 'Kupluk / beanie berbahan rajut yang hangat dan stylish untuk cuaca dingin.',
          stock: 40
        },
      ];

      for (const p of productSeed) {
        const catRow = await pool.query('SELECT id FROM categories WHERE key = $1', [p.category]);
        if (!catRow.rows.length) {
          // eslint-disable-next-line no-console
          console.warn('⚠️  Category not found for product:', p.title, '- category:', p.category);
          continue;
        }
        const catId = catRow.rows[0].id;
        await pool.query(
          `INSERT INTO products (title, description, category_id, image, price, rating, reviews, badge, stock, is_active)
           VALUES ($1, $2, $3, $4, $5, 4.5, 128, 'NEW', $6, true)
           ON CONFLICT (title, category_id) DO NOTHING`,
          [p.title, p.description, catId, p.image, p.price, p.stock]
        );
      }
      // eslint-disable-next-line no-console
      console.log('✅ Products seeded (14 items)');
    } else {
      // eslint-disable-next-line no-console
      console.log('📊 Products table already has ' + prodCount + ' rows, skipping seed');
    }

    // eslint-disable-next-line no-console
    console.log('✨ Migration completed successfully!');
    process.exitCode = 0;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Migration failed:', (err && err.message) || err);
    process.exitCode = 1;
  } finally {
    try {
      await pool.end();
    } catch (e) {
      // ignore
    }
  }
}

// Run migration
migrate();